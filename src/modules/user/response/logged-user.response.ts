import { Expose, Type } from 'class-transformer';

import MovieResponse from '../../movie/response/movie.response';
import { ParamName } from '../../../types/enum/param-name.enum.js';

export default class LoggedUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl!: string;

  @Expose({ name: ParamName.Favorites })
  @Type(() => MovieResponse)
  public favorites!: MovieResponse[];
}
