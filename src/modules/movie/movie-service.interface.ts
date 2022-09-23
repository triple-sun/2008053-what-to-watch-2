import {DocumentType} from '@typegoose/typegoose';

import { Genre } from '../../types/enum/genre.enum.js';
import CreateMovieDTO from './dto/create-movie.dto.js';
import { MovieEntity } from './movie.entity.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDTO): Promise<DocumentType<MovieEntity>>;
  findById(movieID: string): Promise<DocumentType<MovieEntity> | null>;
  findByGenre(genre: Genre): Promise<DocumentType<MovieEntity> | null>;
}
