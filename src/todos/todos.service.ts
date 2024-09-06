import { Injectable } from '@nestjs/common';
import { Prisma, Todos } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class TodosService {
    constructor(private prisma: PrismaService) { }

    async getTodos(): Promise<Todos[] | string> { return await this.prisma.todos.findMany({ orderBy: [{ id: 'asc' }] }) }

    async removeTodo(where: Prisma.TodosWhereUniqueInput) { return await this.prisma.todos.delete({ where }) }

    async completedTodo({ where, data }: { where: Prisma.TodosWhereUniqueInput; data: Prisma.TodosUpdateInput }) { return await this.prisma.todos.update({ where, data }) }

    async addTodo(data: Prisma.TodosCreateInput) { return await this.prisma.todos.create({ data }) }
}