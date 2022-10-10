import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';

import CreateReviewDTO from './dto/create-review.dto.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { ReviewServiceInterface } from './review-service.interface.js';
import { ReviewEntity } from './review.entity.js';
import { IDKeys } from '../../types/enum/id-keys.enum.js';

@injectable()
export default class ReviewService implements ReviewServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>
  ) {}

  public async create(dto: CreateReviewDTO): Promise<DocumentType<ReviewEntity>> {
    const result = await this.reviewModel.create(dto);

    this.logger.info(`${InfoMessage.CommentCreated} ${dto.comment}`);

    return result;
  }

  public async findByMovieID(movieID: string): Promise<DocumentType<ReviewEntity>[]> {
    return this.reviewModel
      .find({movieID: movieID})
      .populate([IDKeys.Movie, IDKeys.User])
      .exec();
  }
}
