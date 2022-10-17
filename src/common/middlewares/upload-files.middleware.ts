import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import multer, {diskStorage, Field} from 'multer';
import mime from 'mime-types';

import { MiddlewareInterface } from '../../types/middleware.interface.js';

export class UploadFilesMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fields: Field[],
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }
    });

    const uploadFilesMiddleware = multer({storage}).fields(this.fields);

    uploadFilesMiddleware(req, res, next);
  }
}
