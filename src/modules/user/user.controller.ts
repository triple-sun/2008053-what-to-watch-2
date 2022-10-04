import {Controller} from '../../common/controller/controller.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {NextFunction, Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Path } from '../../types/enum/path.enum.js';
import { UserServiceInterface } from './user-service.interface.js';
import ConfigService from '../../common/config/config.service.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import UserResponse from './user.response.js';
import { Env } from '../../types/enum/env.enum.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { ErrorDetails } from '../../types/enum/error-details.enum.js';
import LoginUserDTO from './dto/login-user.dto.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigService
  ) {
    super(logger);
    this.logger.info(InfoMessage.UserController);

    this.addRoute({path: Path.Register, method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: Path.Login, method: HttpMethod.Post, handler: this.login});
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
}
