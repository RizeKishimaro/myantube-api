import { HttpException } from "@nestjs/common";

export class ResponseHelper {
  sendSuccessMessage(message = "Success", statusCode = 200, data?: any) {
    return {
      statusCode,
      message,
      data,
    };
  }
  sendErrorMessage(
    statusCode = 500,
    message = "Something went Wrong",
    code = 0,
  ) {
    throw new HttpException(
      {
        statusCode,
        code,
        message,
      },
      statusCode,
    );
  }
}
