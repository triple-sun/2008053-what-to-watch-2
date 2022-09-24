import { createWriteStream, WriteStream} from 'fs';

import { HWMark, RWConfig } from '../../types/enum/rw-config.enum.js';
import { FileWriterInterface } from './file-writer.interface.js';

export default class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: RWConfig.WriteFlags,
      encoding: RWConfig.Encoding,
      highWaterMark: HWMark.Write, // 64KB
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}${RWConfig.EndLine}`)) {
      return new Promise((resolve) => {
        this.stream.once(RWConfig.Drain, () => resolve());
      });
    }
    return Promise.resolve();
  }
}
