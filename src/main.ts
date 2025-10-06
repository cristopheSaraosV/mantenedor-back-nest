import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsInterceptor } from './cors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración CORS robusta
  app.enableCors({
    origin: [
      'http://localhost:51011',
      'http://localhost:4200',
      'http://localhost:3000',
      'https://mantenedor-back-nest-2.onrender.com',
      'https://mantenedor-front-bice.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  // Interceptor global para CORS
  app.useGlobalInterceptors(new CorsInterceptor());
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Servidor ejecutándose en puerto ${port}`);
  console.log(`🌐 CORS configurado para: localhost:4200, localhost:3000, mantenedor-back-nest-2.onrender.com, mantenedor-front-bice.vercel.app`);
}
bootstrap();
