import {NextFunction, Request, Response} from 'express';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import {plainToInstance} from 'class-transformer';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import ValidationError from '../errors/validation-error.js';
import { transformErrors } from '../../utils/common.js';
import { validate } from 'class-validator';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';

export class ValidateDTOMiddleware implements MiddlewareInterface {
  constructor(private DTO: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const {body} = req;
    const dtoInstance = plainToInstance(this.DTO, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`${ErrorMessage.Validation} "${req.path}"`, transformErrors(errors));
    }

    next();
  }
}
