import {Component, Input} from '@angular/core';

import 'widgster';

@Component({
  selector: 'loader',
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss']
})

export class LoaderComponent {
  size: number = 21;

  @Input('size') set sizeLoader(size: number) {
    this.size = size;
  }
}
