import { TUser } from './user.type.js';

export type TReview = {
  comment: string;
  rating: number;
  date: Date
  user: TUser
}
