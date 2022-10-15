import { MaxLength, MinLength, IsInt, IsString, IsMongoId, Min, Max } from 'class-validator';
import { ErrorMessage } from '../../../types/enum/error-message.enum.js';
import { FieldName } from '../../../types/enum/field-name.enum.js';
import { MinMax } from '../../../types/enum/min-max.enum.js';
import { getMaxMessage, getMinMessage, getRequiredMessage } from '../../../utils/common.js';

export default class CreateReviewDTO {
  @IsString({message: getRequiredMessage(FieldName.ReviewComment)})
  @MinLength(MinMax.CommentMin, {message: getMinMessage(MinMax.CommentMin, FieldName.ReviewComment)})
  @MaxLength(MinMax.CommentMax, {message: getMaxMessage(MinMax.CommentMax, FieldName.ReviewComment)})
  public comment!: string;

  @IsInt({message: getRequiredMessage(FieldName.ReviewRating)})
  @Min(MinMax.RatingMin, {message: getMinMessage(MinMax.RatingMin, FieldName.ReviewRating)})
  @Max(MinMax.RatingMax, {message: getMaxMessage(MinMax.RatingMax, FieldName.ReviewRating)})
  public rating!: number;

  public userID!: string;

  @IsMongoId({message: ErrorMessage.ID})
  public movieID!: string;
}

