import { Controller, Get, Query } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("health")
  async health(@Query("ms") ms?: string) {
    const delay = Number(ms || 0);
    if (delay > 0) {
      await new Promise((r) => setTimeout(r, delay));
    }
    return { ok: true, now: Date.now(), delay };
  }
}
