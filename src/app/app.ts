import 'reflect-metadata';
import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';


import { LoggerInterface } from '../common/logger/logger.interface.js';
import { InfoMessage } from '../types/enum/info-message.enum.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { getURI } from '../utils/db.js';
import { Env } from '../types/enum/env.enum.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { Path } from '../types/enum/path.enum.js';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../common/middlewares/authenthicate.middleware.js';
import { getFullServerPath } from '../utils/common.js';

@injectable()
export default class App {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.MovieController) private movieController: ControllerInterface,
    @inject(Component.ReviewController) private reviewController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface
  ) {
    this.expressApp = express();
  }

  public initRoutes() {
    this.expressApp.use(Path.Movies, this.movieController.router);
    this.expressApp.use(Path.Reviews, this.reviewController.router);
    this.expressApp.use(Path.Users, this.userController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use(Path.Upload, express.static(this.config.get(Env.Upload)));

    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get(Env.JWTSecret));

    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApp.use(cors());
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info(InfoMessage.AppInit);
    this.logger.info(`${InfoMessage.PortEnv} ${this.config.get(Env.Port)}`);


    const uri = getURI(
      this.config.get(Env.DBUser),
      this.config.get(Env.DBPass),
      this.config.get(Env.DBHost),
      this.config.get(Env.DBPort),
      this.config.get(Env.DBName),
    );

    await this.databaseClient.connect(uri);

    this.initRoutes();
    this.initMiddleware();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get(Env.Port));
    this.logger.info(`${InfoMessage.ServerStarted} ${getFullServerPath(this.config.get(Env.Host), this.config.get(Env.Port))}`);
  }
}
