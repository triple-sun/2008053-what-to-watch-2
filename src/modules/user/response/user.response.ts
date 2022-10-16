import { Expose, Type } from 'class-transformer';

import MovieResponse from '../../movie/response/movie.response.js';
import { ParamName } from '../../../types/enum/param-name.enum.js';

export default class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose({ name: ParamName.Favorites })
  @Type(() => MovieResponse)
  public favorites!: MovieResponse[];
}
