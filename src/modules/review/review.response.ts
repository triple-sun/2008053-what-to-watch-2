import { Expose, Type } from 'class-transformer';
import { ParamName } from '../../types/enum/param-name.enum.js';
import UserResponse from '../user/user.response.js';

export default class ReviewResponse {
  @Expose()
  public comment!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: ParamName.CreatedAt })
  public date!: Date;

  @Expose({ name: ParamName.UserID })
  @Type(() => UserResponse)
  public user!: UserResponse;
}
