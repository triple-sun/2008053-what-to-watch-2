import chalk from 'chalk';
import { readFileSync } from 'fs';
import { ENCODING, PACKAGE_JSON_URL } from '../const/const.js';
import { Command } from '../types/command.enum.js';
import { CliCommandInterface } from './cli-command.inteface';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = Command.Version;

  private readVersion(): string {
    const contentPageJSON = readFileSync(PACKAGE_JSON_URL, ENCODING);
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute() {
    const version = this.readVersion();
    console.log(chalk.green(version));
  }
}
