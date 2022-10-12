import { Expose, Type } from 'class-transformer';
import MovieResponse from '../movie/movie.response';
import UserResponse from '../user/user.response';

export default class ReviewResponse {
  @Expose()
  public comment!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'createdAt' })
  public date!: Date;

  @Expose({ name: 'userID' })
  @Type(() => UserResponse)
  public user!: UserResponse;
}
