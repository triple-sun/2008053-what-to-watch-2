export const HELP_COMMAND_TEXT = `
Программа для подготовки данных для REST API сервера.
Пример:
    main.js --<command> [--arguments]
Команды:
    --version:                   # выводит номер версии
    --help:                      # печатает этот текст
    --import <path>:             # импортирует данные из TSV
    --generate <n> <path> <url> # генерирует произвольное количество тестовых данных
`;

export const CONFIG_PORT_DEFAULT = 4000;
export const CONFIG_HOST_DEFAULT = 'localhost';

export const DB_PORT_DEFAULT = 27017;
export const DB_HOST_DEFAULT = '127.0.0.1';
export const DB_NAME_DEFAULT = 'course-nodejs-restapi';

export const USER_PASSWORD_DEFAULT = '12345678';

export const MOVIES_COUNT_DEFAULT = 60;

// eslint-disable-next-line no-control-regex
export const emailRegEx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
// http://emailregex.com/

export const JWT_ALGORITM = 'HS256';

export const DEFAULT_AVATAR_FILE_NAME = 'default-avatar.jpg';
export const DEFAULT_BG_HEADER = 'bg-header.jpg';
export const DEFAULT_PLAYER_POSTER = 'player-poster.jpg';

export const STATIC_RESOURCE_FIELDS = [
  'avatarUrl',
  'videoLink',
  'previewVideoLink',
  'posterImage',
  'backgroundImage'
];

export const FILES_UPLOAD_FIELDS = [
  { name: 'video', maxCount: 1 },
  { name: 'previewVideo', maxCount: 1 },
  { name: 'posterImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
];

export const DEFAULT_STATIC_IMAGES = [
  DEFAULT_AVATAR_FILE_NAME,
  DEFAULT_BG_HEADER,
  DEFAULT_PLAYER_POSTER
];
