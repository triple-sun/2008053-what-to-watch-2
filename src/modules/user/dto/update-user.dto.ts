import {IsArray, IsMongoId, IsOptional, IsString, MinLength} from 'class-validator';
import { ErrorMessage } from '../../../types/enum/error-message.enum.js';
import { MinMax } from '../../../types/enum/min-max.enum.js';

export default class UpdateUserDTO {
  @IsOptional()
  @IsString({message: ErrorMessage.Image})
  @MinLength(MinMax.ImageFieldMin, {message: ErrorMessage.ImageLength})
  public avatarUrl?: string;

  @IsOptional()
  @IsArray({message: ErrorMessage.Array})
  @IsMongoId({each: true, message: ErrorMessage.ID})
  public favorites?: string[];
}

