import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';

import CreateUserDTO from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import UpdateUserDTO from './dto/update-user.dto.js';
import { IDKeys } from '../../types/enum/id-keys.enum.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);

    this.logger.info(`${InfoMessage.UserCreated} ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateByID(userID: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userID, dto, {new: true})
      .populate([IDKeys.Favorites])
      .exec();
  }
}
