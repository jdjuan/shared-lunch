import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matToIterable'
})
export class MatToIterablePipe implements PipeTransform {

  transform(object: any, args?: any): any {
    if (object) {
      return Object.keys(object).map(key => object[key]);
    }
    return null;
  }

}
