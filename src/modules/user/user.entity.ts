import chalk from 'chalk';
import mongoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';

import { CollectionName } from '../../types/enum/collection-name.enum.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { FieldName } from '../../types/enum/field-name.enum.js';
import { MinMax } from '../../types/enum/min-max.enum.js';
import { TUser } from '../../types/user.type.js';
import { createSHA256, getMaxMessage, getMinMessage } from '../../utils/common.js';
import { emailRegEx } from '../../const/const.js';

const { modelOptions, prop } = mongoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
  collection: CollectionName.Users
  }
  })
export class UserEntity extends defaultClasses.TimeStamps {
  constructor(data: TUser) {
    super();

    if (data.avatarUrl) {
      this.avatarUrl = data.avatarUrl;
    }

    this.name = data.name;
    this.email = data.email;
    this.favorites = [];
  }

  @prop({
    required: true,
    minlength: [MinMax.UserNameMin, getMinMessage(MinMax.UserNameMin, FieldName.UserName)],
    maxlength: [MinMax.UserNameMax, getMaxMessage(MinMax.UserNameMax, FieldName.UserName)]
    })
  public name!: string;

  @prop({
    required: true,
    trim: true,
    match: [/\.(jpe?g|png)$/i, ErrorMessage.AvatarUrl],
    })
  public avatarUrl!: string;

  @prop({
    required: true,
    default: [],
    })
  public favorites!: string[];

  @prop({
    unique: true,
    required: true,
    match: [emailRegEx, ErrorMessage.Email],
    })
  public email!: string;

  @prop({required: true})
  private password!: string;

  public setPassword(password: string, salt: string) {
    if (password.length < MinMax.UserPassMin || password.length > MinMax.UserPassMax) {
      console.log(chalk.red.bold(ErrorMessage.PasswordLength));
      return;
    }

    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
