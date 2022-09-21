import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import { config, DotenvParseOutput } from 'dotenv';
import { Message } from '../../types/enum/message.enum.js';
import { inject, injectable} from 'inversify';
import { Component } from '../../types/component.types.js';

@injectable()

export default class ConfigService implements ConfigInterface {
  private config: DotenvParseOutput;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(Message.EnvErr);
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info(Message.EnvSuccess);
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
