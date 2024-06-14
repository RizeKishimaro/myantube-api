import { ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ThrottlerException } from "@nestjs/throttler";
export declare class ThrottlerCustomExceptionFilter extends BaseExceptionFilter {
    catch(exception: ThrottlerException, host: ArgumentsHost): void;
}
