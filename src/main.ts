import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { corsConfig } from './cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(corsConfig);

  // Middleware adicional para manejar preflight requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    
    if (req.method === 'OPTIONS') {
      console.log('🔄 Procesando preflight request');
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
      return res.status(204).end();
    }
    next();
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
