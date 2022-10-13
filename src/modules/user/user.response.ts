import {Expose, Type} from 'class-transformer';
import { ParamName } from '../../types/enum/param-name.enum.js';
import MovieResponse from '../movie/movie.response.js';

export default class UserResponse {
  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl?: string;

  @Expose({ name: ParamName.Favorites })
  @Type(() => MovieResponse)
  public favorites!: MovieResponse[];
}
