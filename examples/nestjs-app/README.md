# examples/nestjs-app

Minimal NestJS app exposing **REST** and **GraphQL** endpoints to benchmark with `nest-perf-analyzer`.

## Run

```bash
# inside this folder
npm i
npm run dev
# app listens on http://localhost:3000
```

## Endpoints

- REST: `GET http://localhost:3000/health` (optional `?ms=<delay>` to simulate latency)
- GraphQL: `POST http://localhost:3000/graphql`
  - Example query (see `queries/hello.graphql`):
    ```graphql
    query Hello {
      hello
    }
    ```
  - Latency simulation (see `queries/sleep.graphql`):
    ```graphql
    query Sleep($ms: Int!) {
      sleep(ms: $ms)
    }
    ```

## Benchmark examples (run from repo root after building `nest-perf-analyzer`)

REST:

```bash
node dist/index.js rest --url http://localhost:3000/health --duration 10 --rps 30 --concurrency 10
```

GraphQL:

```bash
node dist/index.js gql --url http://localhost:3000/graphql --query ./examples/nestjs-app/queries/hello.graphql --duration 10 --rps 20 --concurrency 10
```

GraphQL with latency:

```bash
node dist/index.js gql --url http://localhost:3000/graphql --query ./examples/nestjs-app/queries/sleep.graphql --duration 10 --rps 20 --concurrency 10
```

Tip: try `?ms=50` on `/health` or pass `$ms` variable in `sleep` to simulate tail latency.
