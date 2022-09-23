import { inject, injectable} from 'inversify';
import { config, DotenvParseOutput } from 'dotenv';

import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Component } from '../../types/component.types.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';

@injectable()

export default class ConfigService implements ConfigInterface {
  private config: DotenvParseOutput;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(ErrorMessage.Env);
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info(InfoMessage.EnvSuccess);
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
