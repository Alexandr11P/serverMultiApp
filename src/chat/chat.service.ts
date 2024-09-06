import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import generateRandomString from './helpers/randomString';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express'

// @Injectable()
// export class ChatService {
//     constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) { }

//     async sendMessage(data: Prisma.MessagesCreateInput) {
//         await this.prisma.messages.create({ data })
//         const chat = await this.prisma.chat.findUnique({ where: { uid: '' } })
//         chat.users.forEach((e) => this.eventEmitter.emit(`${e}`))

//     }

//     async connect(userName: string, uid: Prisma.ChatWhereUniqueInput) {
//         const chat = await this.prisma.chat.findUnique({ where: uid })
//         if (!chat) { throw new HttpException('Чат не найден', HttpStatus.NOT_FOUND); }
//         if (chat.users.includes(userName)) { throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND); }
//     }
//     async getMessage(uid: Prisma.MessagesWhereInput) {
//         this.prisma.messages.findMany({ where: uid })
//     }
//     async getMessageLong(uid: Prisma.ChatWhereUniqueInput) {
//         const chat = await this.prisma.chat.findUnique({ where: uid })
//         chat.users.forEach((e) => this.eventEmitter.emit(`${e}`))
//     }
//     async createEmit(res: Response, userName: string, uid: Prisma.MessagesWhereInput) {
//         this.eventEmitter.once(userName, async () => {
//             const body = await this.prisma.messages.findMany({ where: uid })
//             res.status(200);
//             res.json(body)
//         })
//         setTimeout(() => res.json({ status: 'refetch' }), 120000)
//     }

//     async emit() { this.eventEmitter.emit('111') }
// }


@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) { }

    async getMessages(id: string) {
        return await this.prisma.message.findMany({
            where: { User: { chatId: id } },
            include: {
                User: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    }

    async createChat(name: string, password: string) {
        let random
        while (true) {
            random = generateRandomString(10)
            const checkUID = await this.prisma.user.findMany({ where: { chatId: random } });
            if (!checkUID[0]) { break }
        }
        return await this.prisma.user.create({ data: { name, password, chatId: random } })
    }

    async registration(name: string, password: string, chatId: string) {
        const checkUserName = await this.prisma.user.findMany({ where: { name, chatId } });
        if (checkUserName[0]) {
            throw new HttpException('Такой пользователь уже существует в данном чате!', HttpStatus.CONFLICT)
        }
        return await this.prisma.user.create({ data: { name, password, chatId } })
    }

    async auth(name: string, password: string, chatId: string) {
        if (!name || !password || !chatId) {
            throw new UnauthorizedException({ message: 'Отсутствует логин или пароль' })
        }
        const checkAuth = await this.prisma.user.findMany({ where: { name, chatId, password } })
        if (!checkAuth[0]) { throw new UnauthorizedException({ message: 'Неверный логин или пароль' }) }
        return checkAuth[0]
    }

    async sendMessage(userId: number, text: string, chatId: string) {
        const create = await this.prisma.message.create({ data: { userId, text } })
        const users = await this.prisma.user.findMany({ where: { chatId } })
        users.forEach((e) => this.eventEmitter.emit(`${e.id}`))
        return create
    }

    async getMessagesLong(res: Response, userId: string, chatId: string) {

        const timeoutId = setTimeout(() => {
            res.json({ status: 'refetch' })
        }, 120000)

        this.eventEmitter.once(userId, async () => {
            const body = await this.prisma.message.findMany({
                where: { User: { chatId } },
                include: {
                    User: {
                        select: {
                            name: true,
                        }
                    }
                }
            })
            clearTimeout(timeoutId)
            res.status(200);
            res.json(body)
        })
    }



    async test() {
        const random = generateRandomString(10)
        const checkUID = await this.prisma.user.findMany({ where: { chatId: random } });
        return { key: checkUID[0], eq: random }
    }
}