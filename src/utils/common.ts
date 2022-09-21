import { Genre } from '../types/enum/genre.enum.js';
import { TMovie } from '../types/movie.type.js';

export const createMovie = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title, description, published, genre,
    released, rating, previewVideoLink, videoLink,
    starring, director, runTime, commentsCount,
    name, email, avatarUrl, password, posterImage,
    backgroundImage, backgroundColor
  ] = tokens;

  return {
    title,
    description,
    published: new Date(published),
    genre: genre as Genre,
    released: Number.parseInt(released, 10),
    rating: Number.parseFloat(rating),
    previewVideoLink,
    videoLink,
    starring: starring.split(','),
    director,
    runTime: Number.parseInt(runTime, 10),
    commentsCount: Number.parseInt(commentsCount, 10),
    user: {name, email, avatarUrl, password},
    posterImage,
    backgroundImage,
    backgroundColor
  } as TMovie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';
