import EventEmitter from 'events';
import { createReadStream } from 'fs';

import { RWConfig, HWMark } from '../../types/enum/rw-config.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';


export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read():Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: HWMark.Read, // 16KB
      encoding: RWConfig.Encoding,
    });

    let lineRead = '';
    let endLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of stream) {
      lineRead += chunk.toString();

      while ((endLinePosition = lineRead.indexOf(RWConfig.EndLine)) >= 0) {
        const completeRow = lineRead.slice(0, endLinePosition + 1);
        lineRead = lineRead.slice(++endLinePosition);
        importedRowCount++;

        await new Promise((resolve) => {
          this.emit(RWConfig.Line, completeRow, resolve);
        });
      }
    }

    this.emit(RWConfig.End, importedRowCount);
  }
}
