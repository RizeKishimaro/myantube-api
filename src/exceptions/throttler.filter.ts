import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const { message } = exception;
    const statusCode = exception.getStatus();

    // Calculate retry time based on TTL (time to live)
    const ttlSeconds = Math.ceil(exception.getResponse()['ttl'] / 1000); // Convert TTL from milliseconds to seconds
    const retryAfter = ttlSeconds; // Retry time in seconds

    // Set Retry-After header in response
    response.setHeader('Retry-After', retryAfter.toString());

    response.status(statusCode).json({
      statusCode,
      message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
    });
  }
}

