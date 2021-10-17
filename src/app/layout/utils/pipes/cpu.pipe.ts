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

export const formateCpu = (value) => {

  const float = parseFloat(`${value}`);

  if (float == 0) return "0";
  if (float < 10) return float.toFixed(3);
  if (float < 100) return float.toFixed(2);

  return float.toFixed(1);

};
