import { Resolver, Query, Args, Int } from "@nestjs/graphql";

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return "hello";
  }

  @Query(() => String)
  async sleep(): Promise<string> {
    const ms = 50; // Fixed delay for now
    await new Promise((r) => setTimeout(r, ms));
    return `slept ${ms}ms`;
  }
}
