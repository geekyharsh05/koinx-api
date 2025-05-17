export class ApiError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public errors?: Array<{ field: string; message: string }>
    ) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  } 