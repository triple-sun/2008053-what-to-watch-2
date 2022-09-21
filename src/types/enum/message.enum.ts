export enum Message {
  AppInit = 'Application initialization…',
  EnvSuccess = '.env file found and successfully parsed!',
  FetchErr = 'Can\'t fetch data from',
  EnvErr = 'Can\'t read .env file. Perhaps the file does not exists.',
  FileErr = 'Can\'t read the file:',
  Logger = 'Logger created…',
  PortEnv = 'Get value from env $PORT:'
}
