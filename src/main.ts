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
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://mantenedor-back-nest-2.onrender.com',
      'https://mantenedor-front-bice.vercel.app'
    ];
    
    const origin = req.headers.origin;
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${origin}`);
    
    // Configurar headers CORS para todas las peticiones
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    if (req.method === 'OPTIONS') {
      console.log('🔄 Procesando preflight request');
      if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400');
        return res.status(204).end();
      } else {
        return res.status(403).json({ error: 'CORS: Origin not allowed' });
      }
    }
    next();
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
