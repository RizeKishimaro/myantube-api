import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    // Calculate retry time as 1 minute (60 seconds) from now
    const now = Date.now(); // Current time in milliseconds
    const retryAfterMilliseconds = now + 60000; // Current time + 60 seconds (1 minute) in milliseconds
    const differenceMilliseconds = retryAfterMilliseconds - now; // Difference in milliseconds
    const retryAfterSeconds = Math.ceil(differenceMilliseconds / 1000); // Convert difference to seconds (rounded up)

    // Set Retry-After header in response
    response.setHeader('Retry-After', retryAfterSeconds.toString());

    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      statusCode,
      message: `Rate limit exceeded. Please try again in ${retryAfterSeconds} seconds.`,
    });
  }
}

