import { Controller, Get } from "@nestjs/common";
import { AptService } from "./apt.service";

@Controller()
export class AptController {

    constructor(private aptService: AptService) { }
    @Get('/allapt')
    getApt() {
        return this.aptService.getApt()
    }
}