#!/usr/bin/env node
import { Command } from "commander";
import { runRest, runGraphQL } from "./runAutocannon.js";
import { writeCsvRow } from "./util/csv.js";

const program = new Command();
program
  .name("npa")
  .description("nest-perf-analyzer — benchmark REST/GraphQL endpoints")
  .version("0.1.0");

program
  .command("rest")
  .description("Run REST benchmark")
  .hook("preAction", assertUrl)
  .requiredOption("--url <url>", "Target URL")
  .option("--duration <seconds>", "Test duration in seconds", "15")
  .option("--rps <number>", "Target requests per second (overallRate)", "50")
  .option("--concurrency <number>", "Concurrent connections", "20")
  .option("--warmup <seconds>", "Warmup duration (0 to skip)", "5")
  .option("--header <k:v...>", "HTTP header(s), can repeat", collectHeaders, {})
  .option("--csv <file>", "Append a CSV row with results")
  .action(async (opts: any) => {
    const result = await runRest({
      url: opts.url,
      duration: parseInt(opts.duration, 10),
      rps: parseInt(opts.rps, 10),
      concurrency: parseInt(opts.concurrency, 10),
      warmup: parseInt(opts.warmup, 10),
      headers: opts.header || {},
    });
    console.log(JSON.stringify(result, null, 2));
    if (opts.csv) {
      await writeCsvRow(opts.csv, { ...result.meta, ...result.metrics });
    }
  });

program
  .command("gql")
  .description("Run GraphQL benchmark")
  .hook("preAction", assertUrl)
  .requiredOption("--query <file>", "GraphQL query file path")
  .requiredOption("--url <url>", "Target URL")
  .option("--duration <seconds>", "Test duration in seconds", "15")
  .option("--rps <number>", "Target requests per second (overallRate)", "50")
  .option("--concurrency <number>", "Concurrent connections", "20")
  .option("--warmup <seconds>", "Warmup duration (0 to skip)", "5")
  .option("--header <k:v...>", "HTTP header(s), can repeat", collectHeaders, {})
  .option("--csv <file>", "Append a CSV row with results")
  .action(async (opts: any) => {
    const result = await runGraphQL({
      url: opts.url,
      duration: parseInt(opts.duration, 10),
      rps: parseInt(opts.rps, 10),
      concurrency: parseInt(opts.concurrency, 10),
      warmup: parseInt(opts.warmup, 10),
      headers: opts.header || {},
      queryFile: opts.query,
    });
    console.log(JSON.stringify(result, null, 2));
    if (opts.csv) {
      await writeCsvRow(opts.csv, { ...result.meta, ...result.metrics });
    }
  });

program.parse(process.argv);

function assertUrl(_thisCommand: Command, actionCommand: Command) {
  const url = actionCommand.getOptionValue("url");
  if (!url) {
    console.error("Error: --url is required");
    process.exit(1);
  }
}

function collectHeaders(value: string, prev: any) {
  // Accept "Key:Value" or "Key=Value"
  const sep = value.includes(":") ? ":" : "=";
  const [k, ...rest] = value.split(sep);
  prev[k.trim()] = rest.join(sep).trim();
  return prev;
}
