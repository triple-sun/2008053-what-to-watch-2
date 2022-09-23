export const getURI = (
  username: string | undefined,
  password: string | undefined,
  host: string | undefined,
  port: number | string | undefined,
  databaseName: string | undefined,
): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;
