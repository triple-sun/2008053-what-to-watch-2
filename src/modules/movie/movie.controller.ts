
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import * as core from 'express-serve-static-core';
import MovieResponse from './movie.response.js';
import CreateMovieDTO from './dto/create-movie.dto.js';
import { ErrorDetails } from '../../types/enum/error-conroller.enum.js';
import { Path } from '../../types/enum/path.enum.js';
import UpdateMovieDTO from './dto/update-movie.dto.js';
import { ParamsGetMovie } from '../../types/params.types.js';
import { ReviewServiceInterface } from '../review/review-service.interface.js';
import ReviewResponse from '../review/review.response.js';
import { ModelName } from '../../types/enum/model-name.enum.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ParamName } from '../../types/enum/param-name.enum.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly reviewService: ReviewServiceInterface,
  ) {
    super(logger);

    this.logger.info(InfoMessage.MovieController);

    this.addRoute({path: Path.Main, method: HttpMethod.Get, handler: this.index});

    this.addRoute({
      path: Path.Main,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDTOMiddleware(CreateMovieDTO)
      ]
    });

    this.addRoute({
      path: `/:${Path.MovieID}`,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware(Path.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID)
      ]
    });


    this.addRoute({
      path: `/:${Path.MovieID}`,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware(Path.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID),
        new ValidateDTOMiddleware(UpdateMovieDTO),
      ]
    });

    this.addRoute({
      path: `/:${Path.MovieID}`,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware(Path.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID)
      ]
    });

    this.addRoute({
      path: `/:${Path.MovieID}${Path.Reviews}`,
      method: HttpMethod.Get,
      handler: this.getReviewsForMovie,
      middlewares: [
        new ValidateObjectIdMiddleware(Path.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID)
      ]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const movies = await this.movieService.find();

    this.ok(res, fillDTO(MovieResponse, movies));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(params.movieID);

    this.ok(res, movie);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDTO>,
    res: Response
  ): Promise<void> {
    const result = await this.movieService.create(body);
    const movie = await this.movieService.findById(result.id);

    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDTO>,
    res: Response
  ): Promise<void> {
    const updatedMovie = await this.movieService.updateById(params.movieID, body);

    this.ok(res, fillDTO(MovieResponse, updatedMovie));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.deleteById(params.movieID);

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async getReviewsForMovie(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ):Promise<void> {
    const reviews = await this.reviewService.findByMovieID(params.movieID);

    this.ok(res, fillDTO(ReviewResponse, reviews));
  }
}
