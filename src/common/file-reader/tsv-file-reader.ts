import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { ENCODING, END, LINE } from '../../const/const.js';
import { FileReaderInterface } from './file-reader.interface.js';


export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
  constructor(public filename: string) {
    super();
  }

  public async read():Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: 16384, // 16KB
      encoding: ENCODING,
    });

    let lineRead = '';
    let endLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of stream) {
      lineRead += chunk.toString();

      while ((endLinePosition = lineRead.indexOf('\n')) >= 0) {
        const completeRow = lineRead.slice(0, endLinePosition + 1);
        lineRead = lineRead.slice(++endLinePosition);
        importedRowCount++;

        this.emit(LINE, completeRow);
      }
    }

    this.emit(END, importedRowCount);
  }
}
