import { Pipe, PipeTransform } from '@angular/core'
import { MaterialComponentType, MATERIAL_INPUT_COMPONENT_TYPES } from '../../../../formdata/model/form-field.model'

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
  transform(matComponentType: MaterialComponentType): RenderableMatComponent {
    switch (true) {
      case MATERIAL_INPUT_COMPONENT_TYPES.includes(matComponentType):
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
      default:
        return RenderableMatComponent.INPUT
    }
  }
}
