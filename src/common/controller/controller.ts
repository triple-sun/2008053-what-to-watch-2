import expressAsyncHandler from 'express-async-handler';
import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { LoggerInterface } from '../logger/logger.interface.js';
import { RouteInterface } from '../../types/route.interface.js';
import { ControllerInterface } from './controller.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { UnknownObject } from '../../types/unknown-object.type.js';
import { getFullServerPath, transformObject } from '../../utils/common.js';
import { ConfigInterface } from '../config/config.interface.js';
import { Env } from '../../types/enum/env.enum.js';
import { STATIC_RESOURCE_FIELDS } from '../../const/const.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = expressAsyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => expressAsyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;

    this._router[route.method](route.path, allHandlers);

    this.logger.info(`${InfoMessage.Route} ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath(data: UnknownObject): void {
    const fullServerPath = getFullServerPath(this.configService.get(Env.Host), this.configService.get(Env.Port));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.configService.get(Env.Static)}`,
      `${fullServerPath}/${this.configService.get(Env.Upload)}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data?: T): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public exists<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CONFLICT, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public deleted(res: Response): void {
    this.send(res, StatusCodes.OK);
  }
}
