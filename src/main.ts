import {Container} from 'inversify';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {Component} from './types/component.types.js';
import {ConfigInterface} from './common/config/config.interface.js';
import App from './app/app.js';
import LoggerService from './common/logger/logger.service.js';
import ConfigService from './common/config/config.service.js';
import 'reflect-metadata';

const appContainer = new Container();

appContainer.bind<App>(Component.App).to(App).inSingletonScope();
appContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
appContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();

const app = appContainer.get<App>(Component.App);

await app.init();
