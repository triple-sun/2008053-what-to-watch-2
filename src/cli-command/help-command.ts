import { CliCommandInterface } from './cli-command.inteface';
import chalk from 'chalk';
import { HELP_COMMAND_TEXT } from '../const/const.js';
import { Command } from '../types/enum/command.enum.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = Command.Help;

  public async execute(): Promise<void> {
    console.log(chalk.yellowBright(HELP_COMMAND_TEXT));
  }
}
