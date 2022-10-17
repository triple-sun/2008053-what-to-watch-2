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
import { CollectionName } from '../../types/enum/collection-name.enum.js';
import { ParamName } from '../../types/enum/param-name.enum.js';

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

  public async findByUserID(userID?: string): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel
      .aggregate([
        {
          $lookup: {
            from: CollectionName.Users,
            pipeline: [
              { $match: {'$_id': userID}},
              { $project:{ favorites: 1 }}
            ],
            as: 'favorites'
          }
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
          {
            id: { $toString: '$_id'},
            reviewCount: { $size: '$ratings'},
            rating: { $avg: '$ratings'},
            isFavorite: userID
              ? {
                '$setIsSubset': [
                  [{ '$toString': '$_id' }],
                  'favorites'
                ]
              }
              : false
          }
        },
        { $unset: ['ratings', 'favorites']},
      ])
      .exec();
  }

  public async findByID(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findById(movieID)
      .populate([ParamName.UserID])
      .exec();
  }

  public async findByTitle(title: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findOne({ title })
      .populate([ParamName.UserID])
      .exec();
  }

  public async findByGenre(genre: Genre): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel
      .find({ genre }, {}, {MOVIES_COUNT_DEFAULT})
      .populate([ParamName.UserID])
      .exec();
  }

  public async deleteByID(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndDelete(movieID)
      .exec();
  }

  public async updateByID(movieID: string, dto: UpdateMovieDTO): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieID, dto, {new: true})
      .populate([ParamName.UserID])
      .exec();
  }

  public async incReviewCount(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel
      .findByIdAndUpdate(movieID, {'$inc': {
        reviewCount: 1,
      }})
      .exec();
  }

  public async updateRating(movieID: string, newRating: number): Promise<DocumentType<MovieEntity, types.BeAnObject> | null> {
    const movie = await this.findByID(movieID);

    return this.movieModel
      .findByIdAndUpdate(movieID, {
        rating: {'$avg': [movie?.rating, newRating]},
      })
      .exec();
  }
}
