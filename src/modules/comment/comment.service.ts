import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';

import CreateCommentDTO from './dto/create-comment.dto.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { InfoMessage } from '../../types/enum/info-message.enum.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private  readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDTO): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);

    this.logger.info(`${InfoMessage.CommentCreated} ${dto.comment}`);

    return result;
  }

  public async findById(commentID: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(commentID).exec();
  }
}
