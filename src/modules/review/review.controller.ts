import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Path } from '../../types/enum/path.enum.js';
import { ReviewServiceInterface } from './review-service.interface.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import { ErrorDetails } from '../../types/enum/error-conroller.enum.js';
import ReviewResponse from './review.response.js';
import CreateReviewDTO from './dto/create-review.dto.js';
import { ModelName } from '../../types/enum/model-name.enum.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-object-id.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ParamName } from '../../types/enum/param-name.enum.js';

@injectable()
export default class ReviewController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly reviewService: ReviewServiceInterface,
  ) {
    super(logger);

    this.logger.info(InfoMessage.ReviewController);

    this.addRoute({
      path: Path.Main,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID),
        new ValidateDTOMiddleware(CreateReviewDTO)
      ]
    });
  }

  public async create(
    {body}: Request<object, object, CreateReviewDTO>,
    res: Response
  ): Promise<void> {
    const review = await this.reviewService.create(body);

    await this.movieService.incReviewCount(body.movieID);

    this.created(res, fillDTO(ReviewResponse, review));
  }
}