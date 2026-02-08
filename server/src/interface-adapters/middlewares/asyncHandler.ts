import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (context: string) =>
  (controller: AsyncController): RequestHandler =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      (error as any).context = context;
      next(error);
    }
  };