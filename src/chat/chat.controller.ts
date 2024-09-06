import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request, Response } from 'express';
import { AuthGuard } from "./auth.guard";




@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) { }
    @Post('/create')
    createChat(@Body() body: { name: string, password: string }) { return this.chatService.createChat(body.name, body.password) }

    @Post('/:id/reg')
    connectChat(@Body() body: { name: string, password: string }, @Param() { id }: { id: string }) {
        return this.chatService.registration(`${body.name}`, `${body.password}`, `${id}`)
    }

    @Post('/:id/auth')
    auth(@Param() { id }: { id: string }, @Body() { name, password }: { name: string, password: string }) { return this.chatService.auth(`${name}`, `${password}`, `${id}`) }

    @UseGuards(AuthGuard)
    @Get('/:id/messages')
    getMessages(@Param() { id }: { id: string }) {
        return this.chatService.getMessages(id)
    }

    @UseGuards(AuthGuard)
    @Post('/:id/message')
    sendMessage(@Req() req: Request, @Body() { text }: { text: string }, @Param() { id }: { id: string }) {
        return this.chatService.sendMessage(Number(req.cookies.id), text, id)
    }

    @UseGuards(AuthGuard)
    @Get('/:id/meslong')
    getMessagesLong(@Param() { id }: { id: string }, @Res() res: Response, @Req() req: Request) {
        return this.chatService.getMessagesLong(res, req.cookies.id, id)
    }
}