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

export const ENCODING = 'utf-8';

export const PACKAGE_JSON_URL = '../package.json';

export const END = 'end';
export const LINE = 'line';

export const CONFIG_PORT_DEFAULT = 4000;
export const DB_HOST_DEFAULT = '127.0.0.1';
