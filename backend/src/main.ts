import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

void bootstrap();
