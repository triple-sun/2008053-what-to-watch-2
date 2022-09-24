import mongoose from 'mongoose';
import {inject, injectable} from 'inversify';

import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { DatabaseInterface } from './database.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';

@injectable()
export default class DatabaseService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info(InfoMessage.DBConnect);
    await mongoose.connect(uri);
    this.logger.info(InfoMessage.DBSuccess);
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info(InfoMessage.DBClosed);
  }
}
