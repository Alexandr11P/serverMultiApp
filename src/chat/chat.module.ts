import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { PrismaModule } from "src/prisma/prisma.module";



@Module({
    providers: [ChatService],
    controllers: [ChatController],
    imports: [PrismaModule]
})
export class ChatModule { }