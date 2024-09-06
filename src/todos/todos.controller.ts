import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { TodosService } from "./todos.service";

@Controller('todos')
export class TodosController {

    constructor(private todosService: TodosService) { }
    @Get()
    getAll() { return this.todosService.getTodos() }

    @Delete()
    removeTodo(@Body() body: { id: number }) { return this.todosService.removeTodo(body) }

    @Put()
    completedTodo(@Body() { id }: { id: number }) { return this.todosService.completedTodo({ where: { id: id }, data: { completed: true } }) }

    @Post()
    addTodo(@Body() body: { text: string }) { return this.todosService.addTodo(body) }
}