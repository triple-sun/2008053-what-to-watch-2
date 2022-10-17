import {DocumentType} from '@typegoose/typegoose';

import CreateMovieDTO from './dto/create-movie.dto.js';
import UpdateMovieDTO from './dto/update-movie.dto.js';
import { Genre } from '../../types/enum/genre.enum.js';
import { MovieEntity } from './movie.entity.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDTO): Promise<DocumentType<MovieEntity>>;
  exists(documentId: string): Promise<boolean>;
  findByUserID(userID?: string): Promise<DocumentType<MovieEntity>[]>;
  findByGenre(genre: Genre): Promise<DocumentType<MovieEntity>[]>;
  findByTitle(title: string): Promise<DocumentType<MovieEntity> | null>;
  findByID(movieID: string): Promise<DocumentType<MovieEntity> | null>;
  deleteByID(movieID: string): Promise<DocumentType<MovieEntity> | null>;
  updateByID(movieID: string, dto: UpdateMovieDTO): Promise<DocumentType<MovieEntity> | null>;
  incReviewCount(movieID: string): Promise<DocumentType<MovieEntity> | null>;
  updateRating(movieID: string, newRating: number): Promise<DocumentType<MovieEntity> | null>;
}
