# nest-perf-analyzer (starter)

Tiny CLI to benchmark REST/GraphQL endpoints. Reports p50/p75/p90/p99, throughput and error rate. Outputs JSON to stdout (and optional CSV).

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

## Examples

REST:

```bash
npa rest --url https://httpbin.org/get --duration 15 --rps 50 --concurrency 20
```

GraphQL:

```bash
npa gql --url https://example.com/graphql --query ./examples/query.graphql --duration 20 --rps 25 --concurrency 10
```

Add headers (repeatable):

```bash
npa rest --url https://httpbin.org/anything --header Authorization:Bearer_TOKEN --header X-Env:staging
```

## CSV

```bash
npa rest --url https://httpbin.org/get --duration 10 --rps 30 --csv results.csv
```

## Roadmap

- HTML report with charts
- Auth helpers / token refresh
- GQL persisted queries example
- Multiple endpoints matrix run
- k6/autocannon adapters
