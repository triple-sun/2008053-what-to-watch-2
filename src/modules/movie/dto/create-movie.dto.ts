import { Genre } from '../../../types/enum/genre.enum.js';

export default class CreateMovieDTO {
  public title!: string;
  public description!: string;
  public published!: Date;
  public genre!: Genre;
  public released!: number;
  public previewVideoLink!: string;
  public videoLink!: string;
  public starring!: string[];
  public director!: string;
  public runTime!: number;
  public userID!: string;
  public posterImage!: string;
  public backgroundImage!: string;
  public backgroundColor!: string;
}
