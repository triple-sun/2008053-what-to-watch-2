import { Genre } from './enum/genre.enum.js';
import { TUser } from './user.type.js';

export type TMovie = {
    title: string;
    description: string;
    published: Date;
    genre: Genre;
    released: number;
    rating: number;
    previewVideoLink: string;
    videoLink: string;
    starring: string[];
    director: string;
    runTime: number;
    reviewsCount: number;
    user: TUser;
    posterImage: string;
    backgroundImage: string;
    backgroundColor: string;
}
