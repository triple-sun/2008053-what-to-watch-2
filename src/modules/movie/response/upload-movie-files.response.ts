import { Expose } from 'class-transformer';

export default class UploadMovieFilesResponse {
  @Expose()
  public videoLink!: string;

  @Expose()
  public previewVideoLink!: string;

  @Expose()
  public posterImage!: string;

  @Expose()
  public backgroundImage!: string;
}
