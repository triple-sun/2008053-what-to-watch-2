import chalk from 'chalk';

import { CliCommandInterface } from './cli-command.interface.js';
import { HELP_COMMAND_TEXT } from '../const/const.js';
import { Command } from '../types/enum/command.enum.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = Command.Help;

  public async execute(): Promise<void> {
    console.log(chalk.yellow(HELP_COMMAND_TEXT));
  }
}
