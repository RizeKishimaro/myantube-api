import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request: Request = context.getRequest();
    const response = context.getResponse();
    
    let ttlSeconds = Math.ceil(Date.now())
    const statusCode = exception.getStatus();
    console.log(request.headers)
    if(request.headers["Retry-After"]){ 
      ttlSeconds = Math.ceil(Date.now());
    }
    const retryAfter = ttlSeconds - Date.now(); 

    response.setHeader('Retry-After', retryAfter.toString());

    response.status(statusCode).json({
      statusCode,
      message: `Rate limit exceeded. Please try again in ${retryAfter / 1000} seconds.`,
    });
  }
}

