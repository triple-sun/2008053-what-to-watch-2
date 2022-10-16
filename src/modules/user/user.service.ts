import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import CreateUserDTO from './dto/create-user.dto.js';
import UpdateUserDTO from './dto/update-user.dto.js';
import LoginUserDTO from './dto/login-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { ParamName } from '../../types/enum/param-name.enum.js';
import { DEFAULT_AVATAR_FILE_NAME } from '../../const/const.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return (await this.userModel
      .exists({_id: documentId})) !== null;
  }

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatarUrl: DEFAULT_AVATAR_FILE_NAME});

    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);

    this.logger.info(`${InfoMessage.UserCreated} ${user.email}`);

    return result;
  }

  public async findByID(userID: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findById(userID)
      .populate([ParamName.Favorites])
      .exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findOne({email})
      .populate([ParamName.Favorites])
      .exec();
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
      .populate([ParamName.Favorites])
      .exec();
  }

  public async verifyUser(dto: LoginUserDTO, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }
}
