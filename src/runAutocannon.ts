import autocannon from "autocannon";
import fs from "fs/promises";

export type RunOptions = {
  url: string;
  duration: number;
  rps: number;
  concurrency: number;
  warmup: number;
  headers: Record<string, string>;
};

export async function runRest(opts: RunOptions) {
  if (opts.warmup > 0) {
    await runOnce({ ...opts, duration: opts.warmup }, { silent: true });
  }
  const res = await runOnce(opts);
  return res;
}

export async function runGraphQL(opts: RunOptions & { queryFile: string }) {
  const query = await fs.readFile(opts.queryFile, "utf8");
  const body = JSON.stringify({ query });
  const headers = { "content-type": "application/json", ...opts.headers };

  if (opts.warmup > 0) {
    await runOnce(
      { ...opts, duration: opts.warmup },
      { method: "POST", headers, body, silent: true }
    );
  }
  const res = await runOnce(opts, { method: "POST", headers, body });
  return res;
}

type Extra = {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
  silent?: boolean;
};

async function runOnce(opts: RunOptions, extra: Extra = {}) {
  return new Promise<any>((resolve, reject) => {
    autocannon(
      {
        url: opts.url,
        duration: opts.duration,
        connections: opts.concurrency,
        pipelining: 1,
        overallRate: opts.rps,
        method: extra.method || "GET",
        headers: extra.headers,
        setupClient: (client: autocannon.Client) => {
          if (extra.body && extra.method === "POST") {
            client.setBody(extra.body);
          }
        },
      },
      (err: Error | null, result: autocannon.Result) => {
        if (err) {
          reject(err);
          return;
        }
        // Compute metrics
        const errors = (result.errors || 0) + (result.timeouts || 0);
        const total = result.requests.total || 0;
        const errorRate = total ? (errors / total) * 100 : 0;

        const metrics = {
          p50: safeNum(result.latency?.p50),
          p75: safeNum(result.latency?.p75),
          p90: safeNum(result.latency?.p90),
          p99: safeNum(result.latency?.p99),
          throughput: safeNum(result.requests?.average),
          totalRequests: total,
          errors,
          errorRate: Number(errorRate.toFixed(2)),
        };

        const meta = {
          url: opts.url,
          duration: opts.duration,
          rps: opts.rps,
          concurrency: opts.concurrency,
          timestamp: new Date().toISOString(),
        };

        resolve({ meta, metrics });
      }
    );
  });
}

function safeNum(x: any): number {
  if (typeof x === "number" && isFinite(x)) return Number(x.toFixed(2));
  return 0;
}
