import {Pipe, PipeTransform} from '@angular/core';
import {bytesToUnits} from '../../../utils/convertMemory';

@Pipe({
  name: 'MemoryPipe',
  pure: false
})
export class MemoryPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      return formateMemory(value);
    }
  }

}

export const formateMemory = (value) => {
  // tslint:disable-next-line:radix
  return parseFloat(value) < 1 ? value.toFixed(3) : bytesToUnits(parseInt(value));
};
