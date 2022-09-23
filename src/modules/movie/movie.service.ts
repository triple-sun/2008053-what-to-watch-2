import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';

import CreateMovieDTO from './dto/create-movie.dto.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { MovieEntity } from './movie.entity.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { Genre } from '../../types/enum/genre.enum.js';

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

  public async findById(movieID: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieID).exec();
  }

  public async findByGenre(genre: Genre): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findOne({genre});
  }
}
