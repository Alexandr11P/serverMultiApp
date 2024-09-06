import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AptModule } from './apt/apt.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client'), }),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TodosModule, AptModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
