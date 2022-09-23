import chalk from 'chalk';

import {LoggerInterface} from '../logger.interface.js';

export default class ConsoleLoggerService implements LoggerInterface {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(chalk.blue(message, ...args));
  }

  public error(message: string, ...args: unknown[]): void {
    console.error(chalk.red.bold(message, ...args));
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(chalk.green(message, ...args));
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(chalk.yellow.italic(message, ...args));
  }
}
