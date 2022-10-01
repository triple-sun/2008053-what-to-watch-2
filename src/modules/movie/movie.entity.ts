import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { CollectionName } from '../../types/enum/collection-name.enum.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { FieldName } from '../../types/enum/field-name.enum.js';
import { Genre } from '../../types/enum/genre.enum.js';
import { MinMax } from '../../types/enum/min-max.enum.js';
import { getMaxMessage, getMinMessage } from '../../utils/common.js';
import { UserEntity } from '../user/user.entity.js';

export interface MovieEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
  collection: CollectionName.Movies
  }
  })

export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: [MinMax.MovieTitleMin, getMinMessage(MinMax.MovieTitleMin, FieldName.MovieTitle)],
    maxlength: [MinMax.MovieTitleMax, getMaxMessage(MinMax.MovieTitleMax, FieldName.MovieTitle)]
    })
  public title!: string;

  @prop({
    required: true,
    trim: true,
    minlength: [MinMax.MovieDescMin, getMinMessage(MinMax.MovieDescMin, FieldName.MovieDesc)],
    maxlength: [MinMax.MovieDescMax, getMaxMessage(MinMax.MovieDescMax, FieldName.MovieDesc)]
    })
  public description!: string;

  @prop({required: true, default: new Date})
  public published!: Date;

  @prop({required: true, type: () => String, enum: Genre})
  public genre!: Genre;

  @prop({required: true})
  public released!: number;

  @prop({required: true, default: MinMax.RatingMin})
  public rating!: number;

  @prop({required: true})
  public previewVideoLink!: string;

  @prop({required: true})
  public videoLink!: string;

  @prop({required: true})
  public starring!: string[];

  @prop({
    required: true,
    minlength: [MinMax.MovieDirectorMin, getMinMessage(MinMax.MovieDirectorMin, FieldName.MovieDirector)],
    maxlength: [MinMax.MovieDirectorMax, getMaxMessage(MinMax.MovieDirectorMax, FieldName.MovieDirector)],
    })
  public director!: string;

  @prop({required: true})
  public runTime!: number;

  @prop({default: 0})
  public reviewCount!: number;

  @prop({required: true, ref: UserEntity})
  public userId!: Ref<UserEntity>;

  @prop({
    required: true,
    match: [/\.(jpe?g)$/i,
    ErrorMessage.MovieImgUrl]
    })
  public posterImage!: string;

  @prop({
    required: true,
    match: [/\.(jpe?g)$/i,
    ErrorMessage.MovieImgUrl]
    })
  public backgroundImage!: string;

  @prop({required: true})
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);