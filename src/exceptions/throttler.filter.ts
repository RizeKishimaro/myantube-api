import { Catch, ArgumentsHost} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { Response } from "express"

@Catch(ThrottlerException)
export class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response:Response = context.getResponse();
    const request = context.getRequest();

    const now = Date.now();
    let retryAfterMilliseconds = now + 60000;
    const differenceMilliseconds = retryAfterMilliseconds - now; 
    if(request.headers["retry-after"]){
      console.log(request.headers["retry-after"]);
      retryAfterMilliseconds =  request.headers["retry-after"];
    }
    const retryAfterSeconds = Math.ceil(differenceMilliseconds / 1000); 

    // Set Retry-After header in response
    const statusCode = exception.getStatus();

    response.setHeader("retry-after",retryAfterMilliseconds.toString()).status(statusCode).json({
      statusCode,
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
    }).send();
  }
}

