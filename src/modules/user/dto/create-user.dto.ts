import { MaxLength, MinLength, IsEmail, IsString } from 'class-validator';
import { ErrorMessage } from '../../../types/enum/error-message.enum.js';
import { FieldName } from '../../../types/enum/field-name.enum.js';
import { MinMax } from '../../../types/enum/min-max.enum.js';
import { getMaxMessage, getMinMessage, getRequiredMessage } from '../../../utils/common.js';

export default class CreateUserDTO {
  @IsString({message: getRequiredMessage(FieldName.UserName)})
  @MinLength(MinMax.UserNameMin, {message: getMinMessage(MinMax.UserNameMin, FieldName.UserName)})
  @MaxLength(MinMax.UserNameMax, {message: getMaxMessage(MinMax.UserNameMax, FieldName.UserName)})
  public name!: string;

  @IsEmail({message: ErrorMessage.Email})
  public email!: string;

  @IsString({message: getRequiredMessage(FieldName.UserPass)})
  @MinLength(MinMax.UserPassMin, {message: getMinMessage(MinMax.UserPassMin, FieldName.UserPass)})
  @MaxLength(MinMax.UserPassMax, {message: getMaxMessage(MinMax.UserPassMax, FieldName.UserName)})
  public password!: string;
}

