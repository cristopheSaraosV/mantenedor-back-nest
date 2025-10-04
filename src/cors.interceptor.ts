import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:3000',
      'https://mantenedor-back-nest-2.onrender.com',
      'https://mantenedor-front-bice.vercel.app'
    ];
    
    const origin = request.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      response.header('Access-Control-Allow-Origin', origin);
      response.header('Access-Control-Allow-Credentials', 'true');
    }
    
    // Agregar headers CORS a todas las respuestas
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    response.header('Access-Control-Max-Age', '86400');
    
    return next.handle().pipe(
      tap(() => {
        console.log(`✅ ${request.method} ${request.url} - CORS headers applied`);
      })
    );
  }
}
