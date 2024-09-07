import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: ['http://multi.alexreactapp.ru'] })
  app.use(cookieParser())
  await app.listen(process.env.PORT);
  console.log('Server started on PORT', process.env.PORT)
}
bootstrap();
