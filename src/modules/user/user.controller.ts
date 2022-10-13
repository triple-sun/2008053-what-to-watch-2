import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import CreateUserDto from './dto/create-user.dto.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Path } from '../../types/enum/path.enum.js';
import { UserServiceInterface } from './user-service.interface.js';
import ConfigService from '../../common/config/config.service.js';
import HttpError from '../../common/errors/http-error.js';
import { fillDTO } from '../../utils/common.js';
import UserResponse from './user.response.js';
import { Env } from '../../types/enum/env.enum.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { ErrorDetails } from '../../types/enum/error-conroller.enum.js';
import LoginUserDTO from './dto/login-user.dto.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { ParamsGetUser } from '../../types/params.types.js';
import UpdateUserDTO from './dto/update-user.dto.js';
import { ParamName } from '../../types/enum/param-name.enum.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ModelName } from '../../types/enum/model-name.enum.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigService,
  ) {
    super(logger);
    this.logger.info(InfoMessage.UserController);

    this.addRoute({
      path: Path.Register,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDTOMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: Path.UserID,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamName.MovieID),
        new DocumentExistsMiddleware(this.userService, ModelName.User, ParamName.UserID),
      ]
    });

    this.addRoute({
      path: Path.Login,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDTOMiddleware(LoginUserDTO)]
    });

    this.addRoute({
      path: `${Path.UserID}${Path.Avatar}`,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamName.UserID),
        new UploadFileMiddleware(this.configService.get(Env.Upload), ParamName.Avatar),
      ]
    });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const alreadyExists = await this.userService.findByEmail(body.email);
    const salt = this.configService.get(Env.Salt);

    if (!salt) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessage.Salt,
        ErrorDetails.UserController
      );
    }

    if (alreadyExists) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `${ErrorMessage.UserEmail} «${body.email}» ${ErrorMessage.Exists}`,
        ErrorDetails.UserController
      );
    }

    const result = await this.userService.create(body, salt as string);

    this.created(res, fillDTO(UserResponse, result));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetUser>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByID(params.userID);

    this.ok(res, user);
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDTO>,
    _res: Response,

  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `${ErrorMessage.UserEmail} ${body.email} ${ErrorMessage.NotFound}`,
        ErrorDetails.UserController,
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      ErrorMessage.NotImplemented,
      ErrorDetails.UserController,
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetUser, Record<string, unknown>, UpdateUserDTO>,
    res: Response
  ): Promise<void> {
    const updatedUser = await this.userService.updateByID(params.userID, body);

    this.ok(res, fillDTO(UserResponse, updatedUser));
  }
}
