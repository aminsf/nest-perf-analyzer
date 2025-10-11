import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("NestJS example listening on http://localhost:3000");
  console.log("REST:     GET  http://localhost:3000/health?ms=50");
  console.log("GraphQL:  POST http://localhost:3000/graphql");
}
bootstrap();
