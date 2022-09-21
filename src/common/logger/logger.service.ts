
import pino, {Logger} from 'pino';
import {LoggerInterface} from './logger.interface.js';
import { injectable } from 'inversify';
import { Message } from '../../types/enum/message.enum.js';

@injectable()
export default class LoggerService implements LoggerInterface{
  private logger!: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info(Message.Logger);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
