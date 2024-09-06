import { Module } from "@nestjs/common";
import { AptService } from "./apt.service";
import { AptController } from "./apt.controller";
import { PrismaModule } from "src/prisma/prisma.module";


@Module({
    providers: [AptService],
    controllers: [AptController],
    imports: [PrismaModule]
})
export class AptModule { }