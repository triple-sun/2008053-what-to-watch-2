import { IsArray, IsDateString, IsEnum, IsInt, MaxLength, MinLength, IsString, IsUrl } from 'class-validator';

import { Genre } from '../../../types/enum/genre.enum.js';
import { ErrorMessage } from '../../../types/enum/error-message.enum.js';
import { MinMax } from '../../../types/enum/min-max.enum.js';
import { FieldName } from '../../../types/enum/field-name.enum.js';
import { getMinMessage, getRequiredMessage } from '../../../utils/common.js';

export default class CreateMovieDTO {
  @IsString({message: getRequiredMessage(FieldName.MovieTitle)})
  @MinLength(MinMax.MovieTitleMin, {message: getMinMessage(MinMax.MovieTitleMin, FieldName.MovieTitle)})
  @MaxLength(MinMax.MovieTitleMax, {message: getMinMessage(MinMax.MovieTitleMax, FieldName.MovieTitle)})
  public title!: string;

  @IsString({message: getRequiredMessage(FieldName.MovieDesc)})
  @MinLength(MinMax.MovieDescMin, {message: getMinMessage(MinMax.MovieDescMin, FieldName.MovieDesc)})
  @MaxLength(MinMax.MovieDescMax, {message: getMinMessage(MinMax.MovieDescMax, FieldName.MovieDesc)})
  public description!: string;

  @IsDateString({}, {message: ErrorMessage.Date})
  public published!: Date;

  @IsEnum(Genre, {message: ErrorMessage.Genre})
  public genre!: Genre;

  @IsInt({message: ErrorMessage.Integer})
  public released!: number;

  @IsUrl({message: ErrorMessage.Link})
  public previewVideoLink!: string;

  @IsUrl({message: ErrorMessage.Link})
  public videoLink!: string;

  @IsArray({message: ErrorMessage.Array})
  public starring!: string[];

  @IsString({message: getRequiredMessage(FieldName.MovieDirector)})
  @MinLength(MinMax.MovieDirectorMin, {message: getMinMessage(MinMax.MovieDirectorMin, FieldName.MovieDirector)})
  @MaxLength(MinMax.MovieDirectorMax, {message: getMinMessage(MinMax.MovieDirectorMax, FieldName.MovieDirector)})
  public director!: string;

  @IsInt({message: ErrorMessage.Integer})
  public runTime!: number;

  public userID!: string;

  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public posterImage!: string;

  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public backgroundImage!: string;

  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public backgroundColor!: string;
}
