import { Pipe, PipeTransform } from '@angular/core'
import { MaterialComponentType } from '../../../../formdata/model/form-field.model'

@Pipe({
  name: 'getInputType',
  standalone: true
})
export class GetInputTypePipe implements PipeTransform {
  transform(value: MaterialComponentType): string {
    switch (value) {
      case MaterialComponentType.COLOR:
        return 'color'
      case MaterialComponentType.DATETIME_LOCAL:
        return 'datetime-local'
      case MaterialComponentType.EMAIL:
        return 'email'
      case MaterialComponentType.MONTH:
        return 'month'
      case MaterialComponentType.NUMBER:
        return 'number'
      case MaterialComponentType.SLIDER:
        return 'number'
      case MaterialComponentType.PASSWORD:
        return 'password'
      case MaterialComponentType.TELEPHONE:
        return 'tel'
      case MaterialComponentType.TEXT:
        return 'text'
      case MaterialComponentType.TIME:
        return 'time'
      case MaterialComponentType.URL:
        return 'url'
      case MaterialComponentType.WEEK:
        return 'week'
      default:
        return 'text'
    }
  }
}
