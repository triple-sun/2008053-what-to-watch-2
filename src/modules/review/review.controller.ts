import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import ReviewResponse from './review.response.js';
import CreateReviewDTO from './dto/create-review.dto.js';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface} from '../../common/logger/logger.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Path } from '../../types/enum/path.enum.js';
import { ReviewServiceInterface } from './review-service.interface.js';
import { HttpMethod } from '../../types/enum/http-method.enum.js';
import { fillDTO } from '../../utils/common.js';
import { ModelName } from '../../types/enum/model-name.enum.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { ParamName } from '../../types/enum/param-name.enum.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

@injectable()
export default class ReviewController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly reviewService: ReviewServiceInterface,
  ) {
    super(logger, configService);

    this.logger.info(InfoMessage.ReviewController);

    this.addRoute({
      path: Path.Main,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateReviewDTO),
        new DocumentExistsMiddleware(this.movieService, ModelName.Movie, ParamName.MovieID),
      ]
    });
  }

  public async create(
    req: Request<object, object, CreateReviewDTO>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;

    const review = await this.reviewService.create({...body, userID: user.id});

    await this.movieService.incReviewCount(body.movieID);
    await this.movieService.updateRating(body.movieID, body.rating);

    this.created(res, fillDTO(ReviewResponse, review));
  }
}
