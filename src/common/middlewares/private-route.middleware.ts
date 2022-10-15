import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import HttpError from '../errors/http-error.js';
import { MiddlewareInterface } from '../../types/middleware.interface.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { ErrorDetails } from '../../types/enum/error-conroller.enum.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        ErrorMessage.Unauthorized,
        ErrorDetails.PrivateRoute
      );
    }

    return next();
  }
}
