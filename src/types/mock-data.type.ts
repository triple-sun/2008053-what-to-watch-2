import { Genre } from './enum/genre.enum.js';

export type TMockData = {
  titles: string[];
  descriptions: string[];
  publishDates: Date[];
  genres: Genre[];
  releaseYears: number[];
  ratings: number[];
  previewVideoLinks: string[];
  videoLinks: string[];
  starringLists: string[][];
  directors: string[];
  runTimes: number[];
  commentCounts: number[];
  names: string[];
  emails: string[];
  avatarUrls: string[];
  passwords: string[];
  posterImages: string[];
  backgroundImages: string[];
  backgroundColors: string[];
};
