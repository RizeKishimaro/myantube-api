import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    // Calculate retry time as 1 minute (60 seconds) from now
    const now = Date.now(); // Current time in milliseconds
    let retryAfterMilliseconds = now + 60000;
    const differenceMilliseconds = retryAfterMilliseconds - now; // Difference in milliseconds
   console.log(request.headers);
    if(request.headers["retry-after"]){
      console.log("existed")
      retryAfterMilliseconds =  request.headers["retry-after"]+ 60000;
    }
    const retryAfterSeconds = Math.ceil(differenceMilliseconds / 1000); // Convert difference to seconds (rounded up)

    // Set Retry-After header in response
    const statusCode = exception.getStatus();

    response.set({"retry-after": retryAfterSeconds.toString()}).status(statusCode).json({
      statusCode,
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
    });
  }
}

