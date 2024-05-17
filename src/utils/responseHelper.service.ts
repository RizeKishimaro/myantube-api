import { HttpException } from "@nestjs/common";

export class ResponseHelper {
  sendSuccessMessage(message = "Success", statusCode = 200, data = {}) {
    return {
      statusCode,
      message,
      data:[data],
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
