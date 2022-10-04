import {injectable} from 'inversify';
import {Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {LoggerInterface} from '../logger/logger.interface.js';
import {RouteInterface} from '../../types/route.interface.js';
import {ControllerInterface} from './controller.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import expressAsyncHandler from 'express-async-handler';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(protected readonly logger: LoggerInterface) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    this._router[route.method](route.path, expressAsyncHandler(route.handler.bind(this)));
    this.logger.info(`${InfoMessage.Route} ${route.method.toUpperCase()} ${route.path}`);
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

  public notFound<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NOT_FOUND, data);
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
