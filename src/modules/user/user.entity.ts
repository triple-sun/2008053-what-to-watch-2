import chalk from 'chalk';
import mongoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';

import { CollectionName } from '../../types/enum/collection-name.enum.js';
import { ErrorMessage } from '../../types/enum/error-message.enum.js';
import { FieldName } from '../../types/enum/field-name.enum.js';
import { MinMax } from '../../types/enum/min-max.enum.js';
import { TUser } from '../../types/user.type.js';
import { createSHA256, getMaxMessage, getMinMessage } from '../../utils/common.js';

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

    this.name = data.name;
    this.avatarUrl = data.avatarUrl;
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
    match: [/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, ErrorMessage.Email],
    })
  public email!: string;

  @prop({required: true})
  private password!: string;

  public setPassword(password: string, salt: string) {
    console.log(password);
    if (password.length < MinMax.UserPassMin || password.length > MinMax.UserPassMax) {
      console.log(chalk.red.bold(ErrorMessage.Password));
      return;
    }

    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
