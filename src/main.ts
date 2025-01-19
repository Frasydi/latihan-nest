import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    }))

  const config = new DocumentBuilder()
    .setTitle('Lab Backend ')
    .setDescription('Lab Backend')
    .setVersion('0.1')
    .addTag('lab')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
