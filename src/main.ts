import 'reflect-metadata';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

import App from './app/app.js';
import DatabaseService from './common/database-client/database.service.js';
import LoggerService from './common/logger/logger.service.js';
import ConfigService from './common/config/config.service.js';
import ReviewService from './modules/review/review.service.js';
import MovieService from './modules/movie/movie.service.js';
import UserService from './modules/user/user.service.js';

import { Component } from './types/component.types.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import { ConfigInterface } from './common/config/config.interface.js';
import { DatabaseInterface } from './common/database-client/database.interface.js';
import { ReviewServiceInterface } from './modules/review/review-service.interface.js';
import { ReviewEntity, ReviewModel } from './modules/review/review.entity.js';
import { MovieServiceInterface } from './modules/movie/movie-service.interface.js';
import { MovieEntity, MovieModel } from './modules/movie/movie.entity.js';
import { UserServiceInterface } from './modules/user/user-service.interface.js';
import { UserEntity, UserModel } from './modules/user/user.entity.js';
import MovieController from './modules/movie/movie.controller.js';
import { ControllerInterface } from './common/controller/controller.interface.js';
import { ExceptionFilterInterface } from './common/errors/exception-filter.interface.js';
import ExceptionFilter from './common/errors/exception-filter.js';
import UserController from './modules/user/user.controller.js';

const appContainer = new Container();

appContainer.bind<App>(Component.App).to(App).inSingletonScope();

appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
appContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
appContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

appContainer.bind<ReviewServiceInterface>(Component.ReviewServiceInterface).to(ReviewService);
appContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);

appContainer.bind<MovieServiceInterface>(Component.MovieServiceInterface).to(MovieService);
appContainer.bind<types.ModelType<MovieEntity>>(Component.MovieModel).toConstantValue(MovieModel);

appContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
appContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

appContainer.bind<ControllerInterface>(Component.MovieController).to(MovieController).inSingletonScope();
appContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();


const app = appContainer.get<App>(Component.App);

await app.init();

