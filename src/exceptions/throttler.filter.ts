import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response = context.getResponse();
    
    let ttlSeconds:number;
    const statusCode = exception.getStatus();
    if(request.headers["Retry-After"]){ 
      ttlSeconds = Math.ceil(Date.now());
    }
    const retryAfter = ttlSeconds; 

    response.setHeader('Retry-After', retryAfter.toString());

    response.status(statusCode).json({
      statusCode,
      message: `Rate limit exceeded. Please try again in ${retryAfter / 1000} seconds.`,
    });
  }
}

