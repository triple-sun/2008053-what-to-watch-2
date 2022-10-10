import {Expose, Type} from 'class-transformer';
import { Genre } from '../../types/enum/genre.enum';
import UserResponse from '../user/user.response';

export default class MovieResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose({ name: 'createdAt' })
  public published!: string;

  @Expose()
  public genre!: Genre;

  @Expose()
  public released!: number;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public videoLink!: string;

  @Expose()
  public starring!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runTime!: number;

  @Expose({ name: 'userID' })
  @Type(() => UserResponse)
  public user!: string;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;

  @Expose()
  public backgroundColor!: string;
}
