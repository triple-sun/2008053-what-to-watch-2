import * as core from 'express-serve-static-core';

import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import CreateMovieDTO from './dto/create-movie.dto.js';
import UpdateMovieDTO from './dto/update-movie.dto.js';
import MovieResponse from './response/movie.response.js';
import ReviewResponse from '../review/review.response.js';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { filesToDTO, fillDTO } from '../../utils/common.js';
import { Path } from '../../types/enum/path.enum.js';
import { ParamsGetMovie } from '../../types/params.types.js';
import { ReviewServiceInterface } from '../review/review-service.interface.js';
import { ModelName } from '../../types/enum/model-name.enum.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ParamName } from '../../types/enum/param-name.enum.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Env } from '../../types/enum/env.enum.js';
import { FILES_UPLOAD_FIELDS } from '../../const/const.js';
import { UploadFilesMiddleware } from '../../common/middlewares/upload-files.middleware.js';
import UploadMovieFilesResponse from './response/upload-movie-files.response.js';

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configInterface: ConfigInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly reviewService: ReviewServiceInterface,
  ) {
    super(logger, configInterface);

    this.logger.info(InfoMessage.MovieController);

    this.addRoute({path: Path.Main, method: HttpMethod.Get, handler: this.index});

    this.addRoute({
      path: Path.Main,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateMovieDTO)
      ]
    });

    this.addRoute({
      path: Path.MovieID,
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamName.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID),
      ]
    });


    this.addRoute({
      path: Path.MovieID,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(UpdateMovieDTO),
        new ValidateObjectIdMiddleware(ParamName.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID),
      ]
    });

    this.addRoute({
      path: Path.MovieID,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ParamName.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID)
      ]
    });

    this.addRoute({
      path: `${Path.MovieID}${Path.Reviews}`,
      method: HttpMethod.Get,
      handler: this.getReviewsForMovie,
      middlewares: [
        new ValidateObjectIdMiddleware(ParamName.MovieID),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID)
      ]
    });

    this.addRoute({
      path: `${Path.MovieID}${Path.Upload}`,
      method: HttpMethod.Post,
      handler: this.uploadFiles,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ParamName.MovieID),
        new UploadFilesMiddleware(this.configService.get(Env.Upload), FILES_UPLOAD_FIELDS),
      ]
    });
  }

  public async index(
    req: Request,
    res: Response
  ): Promise<void> {
    const {user} = req;
    const movies = await this.movieService.findByUserID(user.id);

    this.ok(res, fillDTO(MovieResponse, movies));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findByID(params.movieID);

    this.ok(res, movie);
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDTO>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;
    const result = await this.movieService.create({...body, userID: user.id});
    const movie = await this.movieService.findByID(result.id);

    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetMovie, Record<string, unknown>, UpdateMovieDTO>,
    res: Response
  ): Promise<void> {
    const updatedMovie = await this.movieService.updateByID(params.movieID, body);

    this.ok(res, fillDTO(MovieResponse, updatedMovie));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.deleteByID(params.movieID);

    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async getReviewsForMovie(
    {params}: Request<core.ParamsDictionary | ParamsGetMovie>,
    res: Response
  ):Promise<void> {
    const reviews = await this.reviewService.findByMovieID(params.movieID);

    this.ok(res, fillDTO(ReviewResponse, reviews));
  }

  public async uploadFiles(req: Request<core.ParamsDictionary | ParamsGetMovie>, res: Response) {
    const {params, files} = req;
    const {movieID} = params;
    const updateDTO = filesToDTO(files);

    if (!updateDTO) {
      return;
    }

    await this.movieService.updateByID(movieID, updateDTO);

    this.created(res, fillDTO(UploadMovieFilesResponse, {...updateDTO}));
  }
}
