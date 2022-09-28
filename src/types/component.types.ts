export const Component = {
  App: Symbol.for('App'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ReviewServiceInterface: Symbol.for('ReviewServiceInterface'),
  MovieServiceInterface: Symbol.for('MovieServiceInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  MovieModel: Symbol.for('MovieModel'),
  ReviewModel: Symbol.for('ReviewModel'),
  UserModel: Symbol.for('UserModel')
} as const;
