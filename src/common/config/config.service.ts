import { config } from 'dotenv';
import { inject, injectable} from 'inversify';

import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Component } from '../../types/component.types.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { configSchema, ConfigSchema } from './config.schema.js';

@injectable()

export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error(ErrorMessage.Env);
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info(InfoMessage.EnvSuccess);
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}
