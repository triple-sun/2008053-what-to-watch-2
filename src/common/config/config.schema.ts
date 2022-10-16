import convict from 'convict';
import validator from 'convict-format-with-validator';

import { CONFIG_HOST_DEFAULT, CONFIG_PORT_DEFAULT, DB_HOST_DEFAULT, DB_NAME_DEFAULT, DB_PORT_DEFAULT } from '../../const/const.js';
import { Doc } from '../../types/enum/doc.enum.js';
import { Env } from '../../types/enum/env.enum.js';
import { Format } from '../../types/enum/format.enum.js';
import { Path } from '../../types/enum/path.enum.js';

convict.addFormats(validator);

export type ConfigSchema = {
  HOST: string;
  PORT: number;
  SALT: string;
  UPLOAD: string;
  STATIC: string;
  JWT_SECRET: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
}

export const configSchema = convict<ConfigSchema>({
  HOST: {
    doc: Doc.Host,
    format: String,
    env: Env.Host,
    default: CONFIG_HOST_DEFAULT
  },
  PORT: {
    doc: Doc.Port,
    format: Format.Port,
    env: Env.Port,
    default: CONFIG_PORT_DEFAULT
  },
  SALT: {
    doc: Doc.Salt,
    format: String,
    env: Env.Salt,
    default: null
  },
  UPLOAD: {
    doc: Doc.Upload,
    format: String,
    env: Env.Upload,
    default: null
  },
  STATIC: {
    doc: Doc.Static,
    format: String,
    env: Env.Static,
    default: Path.Static
  },
  DB_HOST: {
    doc: Doc.DBHost,
    format: Format.IP,
    env: Env.DBHost,
    default: DB_HOST_DEFAULT
  },
  JWT_SECRET: {
    doc: Doc.JWTSecret,
    format: String,
    env: Env.JWTSecret,
    default: null
  },
  DB_PORT: {
    doc: Doc.DBPort,
    format: Format.Port,
    env: Env.DBPort,
    default: DB_PORT_DEFAULT,
  },
  DB_USER: {
    doc: Doc.DBUser,
    format: String,
    env: Env.DBUser,
    default: null,
  },
  DB_PASS: {
    doc: Doc.DBPass,
    format: String,
    env: Env.DBPass,
    default: null,
  },
  DB_NAME: {
    doc: Doc.DBName,
    format: String,
    env: Env.DBName,
    default: DB_NAME_DEFAULT
  }
});
