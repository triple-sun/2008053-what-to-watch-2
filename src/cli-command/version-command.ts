import chalk from 'chalk';
import { readFileSync } from 'fs';

import { Command } from '../types/enum/command.enum.js';
import { RWConfig } from '../types/enum/rw-config.enum.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class VersionCommand implements CliCommandInterface {
  public readonly name = Command.Version;

  private readVersion(): string {
    const contentPageJSON = readFileSync(RWConfig.PackageJSONUrl, RWConfig.Encoding);
    const content = JSON.parse(contentPageJSON);
    return content.version;
  }

  public async execute() {
    const version = this.readVersion();
    console.log(chalk.green.italic(version));
  }
}
