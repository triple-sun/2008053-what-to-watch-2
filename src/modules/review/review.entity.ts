import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { TReview } from '../../types/review.type.js';
import { CollectionName } from '../../types/enum/collection-name.enum.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { FieldName } from '../../types/enum/field-name.enum.js';
import { MinMax } from '../../types/enum/min-max.enum.js';
import { getMaxMessage, getMinMessage } from '../../utils/common.js';
import { UserEntity } from '../user/user.entity.js';

export interface ReviewEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
  collection: CollectionName.Reviews
  }
  })
export class ReviewEntity extends defaultClasses.TimeStamps {
  constructor({comment, rating}: TReview) {
    super();

    this.comment = comment;
    this.rating = rating;
  }

  @prop({
    required: true,
    minlength: [MinMax.CommentMin, getMinMessage(MinMax.CommentMin, FieldName.Review)],
    maxlength: [MinMax.CommentMax, getMaxMessage(MinMax.CommentMax, FieldName.Review)]
    })
  public comment!: string;

  @prop({
    default: MinMax.RatingMin,
    required: true,
    min: [MinMax.RatingMin, ErrorMessage.Rating],
    max: [MinMax.RatingMax, ErrorMessage.Rating]
    })
  public rating!: number;

  @prop({default: new Date})
  public date!: Date;

  @prop({
    ref: UserEntity,
    required: true
    })
  public user!: Ref<UserEntity>;
}

export const ReviewModel = getModelForClass(ReviewEntity);
