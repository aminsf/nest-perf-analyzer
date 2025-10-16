# nest-perf-analyzer

[![npm](https://img.shields.io/npm/v/nest-perf-analyzer.svg)](https://www.npmjs.com/package/nest-perf-analyzer)
[![CI](https://github.com/aminsf/nest-perf-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/aminsf/nest-perf-analyzer/actions/workflows/ci.yml)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](#)

Tiny CLI to benchmark REST/GraphQL endpoints. Prints **p50 / p90 / p97.5 / p99**, throughput, and error rate as JSON; can also append a **CSV** row for charts/CI.

## Install

global:

```bash
npm i -g nest-perf-analyzer
```

or run once:

```bash
npx nest-perf-analyzer --help
```

## Install (local dev)

```bash
npm i
npm run dev -- --help
```

## Build

```bash
npm run build
node dist/index.js --help
```

## Usage

REST:

```bash
node dist/index.js rest --url https://httpbin.org/get --duration 10 --rps 30 --concurrency 10
```

GraphQL:

```bash
node dist/index.js gql --url https://example.com/graphql --query ./examples/query.graphql --duration 10 --rps 20 --concurrency 10
```

Headers (repeat `--header`):

```bash
node dist/index.js rest --url https://httpbin.org/anything --header Authorization:Bearer_TOKEN --header X-Env:staging
```

CSV:

```bash
node dist/index.js rest --url https://httpbin.org/get --duration 10 --rps 30 --csv results.csv
```

## Example JSON output

```json
{
  "meta": {
    "url": "https://httpbin.org/get",
    "duration": 10,
    "rps": 30,
    "concurrency": 20,
    "timestamp": "..."
  },
  "metrics": {
    "p50": 557,
    "p90": 1720,
    "p97_5": 5682,
    "p99": 7617,
    "throughput": 14.1,
    "totalRequests": 141,
    "errors": 0,
    "errorRate": 0
  }
}
```

## Why?

- Tail latency matters more than averages, this tool gives you **p90/p97.5/p99** quickly.
- Outputs **JSON** for scripts/dashboards and **CSV** for spreadsheets.
- Lightweight defaults so you can reproduce results and share them publicly.

## Roadmap

- HTML report with charts
- Auth helpers / token refresh
- GQL persisted queries & variables
- Multiple endpoints matrix run
- k6/autocannon interchangeable engines

## Used by

- Your project here (PR welcome to add your company/project name)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Good first issues are tagged in the tracker.

## License

MIT © Amin Safaei
