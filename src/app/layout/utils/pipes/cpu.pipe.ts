import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'CpuPipe',
  pure: true

})
export class CpuPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      return formateCpu(value);
    }
  }

}

const formateCpu = (value) => {

  if (value === 0) {
    return 0;
  }
  if (value < 10) {
    return value.toFixed(3);
  }
  if (value < 100) {
    return value.toFixed(2);
  }
  return value.toFixed(1);

};
