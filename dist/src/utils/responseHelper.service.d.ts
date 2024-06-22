export declare class ResponseHelper {
    sendSuccessMessage(message?: string, statusCode?: number, data?: any): {
        statusCode: number;
        message: string;
        data: any;
    };
    sendErrorMessage(statusCode?: number, message?: string, code?: number): void;
}
