import {Pipe, PipeTransform} from '@angular/core';
import {formatDuration} from '../../../utils/shared.utils';
@Pipe({
  name: 'AgePipe',
  pure: false
})
export class AgePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      return formatDuration(value, true);
    }

  }

}
