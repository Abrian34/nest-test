import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
// import * as dayjs from "dayjs";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception.response?.message || exception.message || "Bad Request";

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      // timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
  }
}
