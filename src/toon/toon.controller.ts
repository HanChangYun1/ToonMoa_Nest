import { Controller, Get, Param } from "@nestjs/common";
import { ToonService } from "./toon.service";

@Controller("toon")
export class ToonController {
  constructor(private readonly toonService: ToonService) {}

  @Get("/:service")
  async getToonByService(@Param("service") service: string) {
    return this.toonService.getToonService(service);
  }

  @Get("/:service/:date")
  async getToonByDate(
    @Param("service") service: string,
    @Param("date") date: string
  ) {
    return this.toonService.getToonDate(service, date);
  }
}
