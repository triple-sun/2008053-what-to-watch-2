import crypto from 'crypto';
import * as jose from'jose';

import { Genre } from '../types/enum/genre.enum.js';
import { TMovie } from '../types/movie.type.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ServiceError } from '../types/enum/service-error.enum.js';
import { DEFAULT_STATIC_IMAGES } from '../const/const.js';
import { UnknownObject } from '../types/unknown-object.type.js';

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

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;

      target[property] = `${rootPath}/${target[property]}`;
    }));
};

export const filesToDTO = (files: Express.Multer.File[] | {[fieldname: string]: Express.Multer.File[]} | Express.Multer.File[] | undefined): Record<string, unknown> | void => {
  if (!files) {
    return;
  }
  const result = Object.values(files);

  return result.reduce((obj, item) => {
    obj.fieldname = item.path;
    return obj;
  }, {});
};
