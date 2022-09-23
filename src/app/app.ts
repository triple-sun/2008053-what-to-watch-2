import 'reflect-metadata';
import {inject, injectable} from 'inversify';

import { LoggerInterface } from '../common/logger/logger.interface.js';
import { InfoMessage } from '../types/enum/info-message.enum.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { getURI } from '../utils/db.js';
import { Env } from '../types/enum/env.enum.js';

@injectable()
export default class App {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface
  ) {}

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
  }
}
