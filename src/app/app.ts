import {LoggerInterface} from '../common/logger/logger.interface.js';
import { Message } from '../types/enum/message.enum.js';
import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';

@injectable()
export default class App {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface
  ) {}

  public async init() {
    this.logger.info(Message.AppInit);
    this.logger.info(`${Message.PortEnv} ${this.config.get('PORT')}`);
  }
}
