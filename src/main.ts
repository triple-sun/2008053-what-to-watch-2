import 'reflect-metadata';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

import App from './app/app.js';
import DatabaseService from './common/database-client/database.service.js';
import LoggerService from './common/logger/logger.service.js';
import ConfigService from './common/config/config.service.js';
import CommentService from './modules/comment/comment.service.js';
import MovieService from './modules/movie/movie.service.js';
import UserService from './modules/user/user.service.js';

import { Component } from './types/component.types.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import { ConfigInterface } from './common/config/config.interface.js';
import { DatabaseInterface } from './common/database-client/database.interface.js';
import { CommentServiceInterface } from './modules/comment/comment-service.interface.js';
import { CommentEntity, CommentModel } from './modules/comment/comment.entity.js';
import { MovieServiceInterface } from './modules/movie/movie-service.interface.js';
import { MovieEntity, MovieModel } from './modules/movie/movie.entity.js';
import { UserServiceInterface } from './modules/user/user-service.interface.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';


const appContainer = new Container();

appContainer.bind<App>(Component.App).to(App).inSingletonScope();

appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();

appContainer.bind<CommentServiceInterface>(Component.CommentServiceInterface).to(CommentService);
appContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

appContainer.bind<MovieServiceInterface>(Component.MovieServiceInterface).to(MovieService);
appContainer.bind<types.ModelType<MovieEntity>>(Component.MovieModel).toConstantValue(MovieModel);

appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

const app = appContainer.get<App>(Component.App);

await app.init();
