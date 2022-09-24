export enum RWConfig {
  Drain = 'drain',
  Line = 'line',
  End = 'end',
  Encoding = 'utf-8',
  EndLine = '\n',
  WriteFlags = 'w',
  PackageJSONUrl = '../package.json',
}

export enum HWMark {
  Read = 16384,
  Write = 2 ** 16
}
