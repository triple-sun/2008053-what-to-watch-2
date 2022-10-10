import {IsArray, IsMongoId} from 'class-validator';
import { ErrorMessage } from '../../../types/enum/error-message.enum.js';

export default class UpdateUserDTO {
  @IsArray({message: ErrorMessage.Array})
  @IsMongoId({each: true, message: ErrorMessage.ID})
  public favorites?: string[];
}

