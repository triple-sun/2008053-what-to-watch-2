import {DocumentType} from '@typegoose/typegoose';

import { Genre } from '../../types/enum/genre.enum.js';
import CreateMovieDTO from './dto/create-movie.dto.js';
import UpdateMovieDTO from './dto/update-movie.dto.js';
import { MovieEntity } from './movie.entity.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDTO): Promise<DocumentType<MovieEntity>>;
  exists(documentId: string): Promise<boolean>;
  find(): Promise<DocumentType<MovieEntity>[]>;
  findByGenre(genre: Genre): Promise<DocumentType<MovieEntity>[]>;
  findById(movieID: string): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieID: string): Promise<DocumentType<MovieEntity> | null>;
  updateById(movieID: string, dto: UpdateMovieDTO): Promise<DocumentType<MovieEntity> | null>;
  incReviewCount(movieID: string): Promise<DocumentType<MovieEntity> | null>;
}
