import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from './apiError';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next)
      .then(result => res.status(200).json(result))
      .catch(error => {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors
          });
        } else {
          res.status(500).json({
            success: false,
            message: 'Internal Server Error'
          });
        }
      });
  };
};