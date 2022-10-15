import { DocumentType } from '@typegoose/typegoose';

import CreateReviewDTO from './dto/create-review.dto.js';
import { ReviewEntity } from './review.entity.js';

export interface ReviewServiceInterface {
  create(dto: CreateReviewDTO): Promise<DocumentType<ReviewEntity>>;
  findByMovieID(movieID: string): Promise<DocumentType<ReviewEntity>[]>;
}
