import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nest-js Swagger Example API')
    .setDescription('Swagger Example API API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // Swagger path: http://localhost:3200/api/docs
  SwaggerModule.setup(`${'api/v1'}/docs`, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5003);
}
bootstrap();
