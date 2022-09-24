export const Component = {
  App: Symbol.for('App'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  MovieServiceInterface: Symbol.for('MovieServiceInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
  MovieModel: Symbol.for('MovieModel'),
  UserModel: Symbol.for('UserModel')
} as const;
