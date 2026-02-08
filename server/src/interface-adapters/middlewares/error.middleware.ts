import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}

export const globalErrorHandler = (
  error: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${error.name}: ${error.message}`);

  const statusCode = error.statusCode || 500;
  const message = error.statusCode 
    ? error.message 
    : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && !error.statusCode && { 
      error: error.message,
      stack: error.stack 
    })
  });
};