import { Pipe, PipeTransform } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Pipe({
  name: 'getRawValue',
  standalone: true,
})
export class GetRawValuePipe implements PipeTransform {

  transform(control: AbstractControl): any {
    return control.getRawValue()
  }

}
