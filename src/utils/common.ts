import { Genre } from '../types/enum/genre.enum.js';
import { TMovie } from '../types/movie.type.js';
import crypto from 'crypto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

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
    starring: starring.split(', '),
    director,
    runTime: Number.parseInt(runTime, 10),
    reviewsCount: Number.parseInt(commentsCount, 10),
    user: {name, email, avatarUrl, password},
    posterImage,
    backgroundImage,
    backgroundColor
  } as TMovie;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const getMinMessage = (min: number, name: string) => `${name} must contain at least ${min} symbol${min > 1 ? 's' : ''}`;
export const getMaxMessage = (max: number, name: string) => `${name} must be ${max} symbol${max > 1 ? 's' : ''} or less`;

export const getRequiredMessage = (name: string) => `${name} is required`;

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({error: message});
