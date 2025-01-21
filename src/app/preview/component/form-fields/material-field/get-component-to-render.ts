import { Pipe, PipeTransform } from '@angular/core'
import { MaterialComponentType } from '../../../../formdata/model/form-field.model'

export enum RenderableMatComponent {
  INPUT = 'INPUT',
  TEXTAREA = 'TEXTAREA',

  CHECKBOX = 'CHECKBOX',
  SLIDE_TOGGLE = 'SLIDE_TOGGLE',

  SLIDER = 'SLIDER',
  DATEPICKER = 'DATEPICKER',

  RADIO_BUTTON = 'RADIO_BUTTON',
  SELECT = 'SELECT',

  BUTTON_TOGGLE = 'BUTTON_TOGGLE',
  // CHIPS = 'CHIPS',
}


@Pipe({
  name: 'getComponentToRender',
  standalone: true,
})
export class GetComponentToRenderPipe implements PipeTransform {
  inputComponentType = [
    MaterialComponentType.COLOR,
    MaterialComponentType.DATETIME_LOCAL,
    MaterialComponentType.EMAIL,
    MaterialComponentType.MONTH,
    MaterialComponentType.NUMBER,
    MaterialComponentType.PASSWORD,
    MaterialComponentType.TELEPHONE,
    MaterialComponentType.TEXT,
    MaterialComponentType.TIME,
    MaterialComponentType.URL,
    MaterialComponentType.WEEK,
  ]

  transform(matComponentType: MaterialComponentType): RenderableMatComponent {
    switch (true) {
      case this.inputComponentType.includes(matComponentType):
        return RenderableMatComponent.INPUT
      case matComponentType === MaterialComponentType.TEXTAREA:
        return RenderableMatComponent.TEXTAREA
      case matComponentType === MaterialComponentType.CHECKBOX:
        return RenderableMatComponent.CHECKBOX
      case matComponentType === MaterialComponentType.SLIDE_TOGGLE:
        return RenderableMatComponent.SLIDE_TOGGLE
      case matComponentType === MaterialComponentType.SLIDER:
        return RenderableMatComponent.SLIDER
      case matComponentType === MaterialComponentType.DATE:
        return RenderableMatComponent.DATEPICKER
      case matComponentType === MaterialComponentType.RADIO_BUTTON:
        return RenderableMatComponent.RADIO_BUTTON
      case matComponentType === MaterialComponentType.SELECT:
        return RenderableMatComponent.SELECT
      case matComponentType === MaterialComponentType.BUTTON_TOGGLE:
        return RenderableMatComponent.BUTTON_TOGGLE
      // case matComponentType === MaterialComponentType.CHIPS:
      //   return RenderableMatComponent.CHIPS
      default:
        return RenderableMatComponent.INPUT
    }
  }
}
