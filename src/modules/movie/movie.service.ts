import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';

import CreateMovieDTO from './dto/create-movie.dto.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { MovieEntity } from './movie.entity.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Genre } from '../../types/enum/genre.enum.js';
import UpdateMovieDTO from './dto/update-movie.dto.js';
import { MOVIES_COUNT_DEFAULT } from '../../const/const.js';
import { IDKeys } from '../../types/enum/id-keys.enum.js';
import { CollectionName } from '../../types/enum/collection-name.enum.js';

@injectable()
export default class MovieService implements MovieServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDTO): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`${InfoMessage.MovieCreated} ${dto.title}`);

    return result;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.movieModel
      .exists({_id: documentId})) !== null;
  }

  public async find(): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel
      .aggregate([
        {
          $lookup: {
            from: CollectionName.Reviews,
            pipeline: [
              { $match: {movieID: '$_id'}},
              { $project: { _id: 1 }}
            ],
            as: 'reviews'
          },
        },
        {
          $lookup: {
            from: CollectionName.Reviews,
            pipeline: [
              { $match: {movieID: '$_id'}},
              { $project:{ rating: 1 }}
            ],
            as: 'ratings'
          }
        },
        { $addFields:
          { id: { $toString: '$_id'}, reviewCount: { $size: '$reviews'}, rating: { $avg: '$ratings'}}
        },
        { $unset: ['reviews, ratings']},
      ])
      .exec();
  }

  public async findById(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findById(movieID)
      .populate([IDKeys.User])
      .exec();
  }

  public async findByGenre(genre: Genre): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel
      .find({ genre: genre }, {}, {MOVIES_COUNT_DEFAULT})
      .populate([IDKeys.User])
      .exec();
  }

  public async deleteById(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndDelete(movieID)
      .exec();
  }

  public async updateById(movieID: string, dto: UpdateMovieDTO): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieID, dto, {new: true})
      .populate([IDKeys.User])
      .exec();
  }

  public async incReviewCount(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieID, {'$inc': {
        reviewCount: 1,
      }}).exec();
  }
}
