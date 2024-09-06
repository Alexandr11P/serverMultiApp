
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req: Request = context.switchToHttp().getRequest();
        const { name, password, id } = req.cookies;
        const chatId = req.params.id
        const response: Response = context.switchToHttp().getResponse();
        const findChat = await this.prisma.user.findMany({ where: { chatId } });

        if (!findChat[0]) {
            throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND)
        }

        const findUser = (name && password && id)
            ? await this.prisma.user.findMany({ where: { name, chatId, password, id: Number(id) } })
            : []

        if (!findUser[0]) {
            for (const e of ['name', 'password', 'id']) { response.cookie(e, '', { maxAge: 0 }) }
            throw new UnauthorizedException({ message: 'Пользователь не авторизован' })
        }
        return true
    }
}