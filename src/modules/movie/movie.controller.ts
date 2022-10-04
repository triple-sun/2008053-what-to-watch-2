
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import MovieResponse from './movie.response.js';
import CreateMovieDTO from './dto/create-movie.dto.js';
import HttpError from '../../common/errors/http-error.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { ErrorDetails } from '../../types/enum/error-details.enum.js';
import { Path } from '../../types/enum/path.enum.js';
import UpdateMovieDTO from './dto/update-movie.dto.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
  ) {
    super(logger);

    this.logger.info(InfoMessage.MovieController);

    this.addRoute({path: Path.Main, method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: Path.Main, method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: Path.Main, method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: Path.Main, method: HttpMethod.Delete, handler: this.delete});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const movies = await this.movieService.find();
    const movieResponse = fillDTO(MovieResponse, movies);
    this.send(res, StatusCodes.OK, movieResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDTO>,
    res: Response): Promise<void> {

    const alreadyExists = await this.movieService.findByTitle(body.title);

    if (alreadyExists) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `${ErrorMessage.Movie} «${body.title}» ${ErrorMessage.Exists}`,
        ErrorDetails.MovieController
      );
    }

    const result = await this.movieService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(MovieResponse, result)
    );
  }

  public async update(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateMovieDTO>,
    res: Response): Promise<void> {

    const exists = await this.movieService.exists(body.id);

    if (!exists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${ErrorMessage.Movie} «${body.title}» ${ErrorMessage.NotFound}`,
        ErrorDetails.MovieController
      );
    }

    const result = await this.movieService.updateById(body.id, body);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(MovieResponse, result)
    );
  }

  public async delete(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateMovieDTO>,
    res: Response): Promise<void> {

    const exists = await this.movieService.exists(body.id);

    if (!exists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${ErrorMessage.Movie} «${body.title}» ${ErrorMessage.NotFound}`,
        ErrorDetails.MovieController
      );
    }

    const result = await this.movieService.deleteById(body.id);
    this.send(
      res,
      StatusCodes.OK,
      fillDTO(MovieResponse, result)
    );
  }
}
