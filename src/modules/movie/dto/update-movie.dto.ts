import { IsArray, IsEnum, IsInt, MaxLength, MinLength, IsOptional, IsString, IsUrl } from 'class-validator';

import { Genre } from '../../../types/enum/genre.enum.js';
import { ErrorMessage } from '../../../types/enum/error-message.enum.js';
import { MinMax } from '../../../types/enum/min-max.enum.js';
import { FieldName } from '../../../types/enum/field-name.enum.js';
import { getMaxMessage, getMinMessage, getRequiredMessage } from '../../../utils/common.js';

export default class UpdateMovieDTO {
  @IsOptional()
  @MinLength(MinMax.MovieTitleMin, {message: getMinMessage(MinMax.MovieTitleMin, FieldName.MovieTitle)})
  @MaxLength(MinMax.MovieTitleMax, {message: getMaxMessage(MinMax.MovieTitleMax, FieldName.MovieTitle)})
  public title?: string;

  @IsOptional()
  @MinLength(MinMax.MovieDescMin, {message: getMinMessage(MinMax.MovieDescMin, FieldName.MovieDesc)})
  @MaxLength(MinMax.MovieDescMax, {message: getMaxMessage(MinMax.MovieDescMax, FieldName.MovieDesc)})
  public description?: string;

  @IsOptional()
  @IsEnum(Genre, {message: ErrorMessage.Genre})
  public genre?: Genre;

  @IsOptional()
  @IsInt({message: ErrorMessage.Integer})
  public released?: number;

  @IsOptional()
  @IsUrl({message: ErrorMessage.Link})
  public previewVideoLink?: string;

  @IsOptional()
  @IsUrl({message: ErrorMessage.Link})
  public videoLink?: string;

  @IsOptional()
  @IsArray({message: ErrorMessage.Array})
  public starring?: string[];

  @IsOptional()
  @IsString({message: getRequiredMessage(FieldName.MovieDirector)})
  @MinLength(MinMax.MovieDirectorMin, {message: getMinMessage(MinMax.MovieDirectorMin, FieldName.MovieDirector)})
  @MaxLength(MinMax.MovieDirectorMax, {message: getMaxMessage(MinMax.MovieDirectorMax, FieldName.MovieDirector)})
  public director?: string;

  @IsInt({message: ErrorMessage.Integer})
  public runTime?: number;

  @IsString({message: ErrorMessage.Image})
  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public posterImage?: string;

  @IsString({message: ErrorMessage.Image})
  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public backgroundImage?: string;

  @IsString({message: ErrorMessage.Image})
  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public backgroundColor?: string;
}
