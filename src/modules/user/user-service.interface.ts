import { DocumentType } from '@typegoose/typegoose';

import CreateUserDTO from './dto/create-user.dto.js';
import UpdateUserDTO from './dto/update-user.dto.js';
import LoginUserDTO from './dto/login-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  exists(documentId: string): Promise<boolean>;
  findByID(movieID: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  updateByID(userID: string, dto: UpdateUserDTO): Promise<DocumentType<UserEntity> | null>
  verifyUser(dto: LoginUserDTO, salt: string): Promise<DocumentType<UserEntity> | null>;
}
