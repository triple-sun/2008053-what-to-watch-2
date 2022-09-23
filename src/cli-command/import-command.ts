import chalk from 'chalk';

import { DatabaseInterface } from '../common/database-client/database.interface.js';
import DatabaseService from '../common/database-client/database.service.js';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import ConsoleLoggerService from '../common/logger/console-logger/console-logger.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { DB_PORT_DEFAULT, USER_PASSWORD_DEFAULT } from '../const/const.js';
import { MovieServiceInterface } from '../modules/movie/movie-service.interface.js';
import { MovieModel } from '../modules/movie/movie.entity.js';
import MovieService from '../modules/movie/movie.service.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { UserModel } from '../modules/user/user.entity.js';
import UserService from '../modules/user/user.service.js';
import { Command } from '../types/enum/command.enum.js';
import { ErrorMessage } from '../types/enum/error-message.enum.js';
import { InfoMessage } from '../types/enum/info-message.enum.js';
import { RWConfig } from '../types/enum/rw-config.enum.js';
import { TMovie } from '../types/movie.type.js';
import { createMovie, getErrorMessage } from '../utils/common.js';
import { getURI } from '../utils/db.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = Command.Import;

  private movieService!: MovieServiceInterface;
  private userService!: UserServiceInterface;
  private databaseService!: DatabaseInterface;

  private logger: LoggerInterface;
  private salt!: string;

  private async saveMovie(movie: TMovie) {
    const user = await this.userService.findOrCreate({
      ...movie.user,
      password: USER_PASSWORD_DEFAULT
    }, this.salt);

    await this.movieService.create({
      ...movie,
      userID: user.id
    });
  }

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createMovie(line);
    await this.saveMovie(movie);
    resolve();
  }

  private onComplete(count: number) {
    console.log(chalk.green(`${count} ${InfoMessage.Rows}`));
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, DB_PORT_DEFAULT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on(RWConfig.Line, this.onLine);
    fileReader.on(RWConfig.End, this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(chalk.red.bold(`${ErrorMessage.File} ${getErrorMessage(err)}`));
    }
  }
}
