import convict from 'convict';
import validator from 'convict-format-with-validator';
import { CONFIG_PORT_DEFAULT, DB_HOST_DEFAULT } from '../../const/const.js';
import { Config } from '../../types/enum/config.enum.js';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: Config.PortDoc,
    format: Config.PortFormat,
    env: Config.PortEnv,
    default: CONFIG_PORT_DEFAULT
  },
  SALT: {
    doc: Config.SaltDoc,
    format: String,
    env: Config.SaltEnv,
    default: null
  },
  DB_HOST: {
    doc: Config.DBDoc,
    format: Config.DBFormat,
    env: Config.DBEnv,
    default: DB_HOST_DEFAULT
  }
});
