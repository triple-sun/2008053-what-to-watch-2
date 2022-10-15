declare namespace Express {
  export interface Request {
    user: {
      id: string,
      email: string,
      avatarUrl: string,
      favorites: string[]
    }
  }
}
