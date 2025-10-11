import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppResolver } from "./app.resolver";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppResolver],
})
export class AppModule {}
