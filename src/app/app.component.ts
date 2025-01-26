import { Component, inject, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutComponent } from './common/component/layout/layout.component'
import { GlobalMessagesSnackBarComponent } from './common/component/error-handling/global-message-snack-bar/global-messages-snack-bar.component'
import Handlebars from 'handlebars'
import { HttpClient } from '@angular/common/http'
import { MATERIAL_INPUT_COMPONENT_TYPES, MaterialComponentType } from './formdata/model/form-field.model'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, GlobalMessagesSnackBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient)

  ngOnInit() {
    this.registerHandlebarHelpers()
  }

  registerHandlebarHelpers() {
    Handlebars.registerHelper('isDefined', (value: any) => value != null && value != '')
    Handlebars.registerHelper('inputType', (value: MaterialComponentType) => this.getInputType(value))

    Handlebars.registerHelper('getComponentTemplate', (value: MaterialComponentType) => this.getComponentToRender(value))
  }

  getInputType(value: MaterialComponentType): string {
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

  getComponentToRender(matComponentType: MaterialComponentType): string {
    switch (true) {
      case MATERIAL_INPUT_COMPONENT_TYPES.includes(matComponentType):
        return 'inputField'
      case matComponentType === MaterialComponentType.TEXTAREA:
        return 'textareaField'
      case matComponentType === MaterialComponentType.CHECKBOX:
        return 'checkboxField'
      case matComponentType === MaterialComponentType.SLIDE_TOGGLE:
        return 'slideToggleField'
      case matComponentType === MaterialComponentType.SLIDER:
        return 'sliderField'
      case matComponentType === MaterialComponentType.DATE:
        return 'datepickerField'
      case matComponentType === MaterialComponentType.RADIO_BUTTON:
        return 'radioButtonField'
      case matComponentType === MaterialComponentType.SELECT:
        return 'selectField'
      case matComponentType === MaterialComponentType.BUTTON_TOGGLE:
        return 'buttonToggleField'
      // case matComponentType === MaterialComponentType.CHIPS:
      //   return RenderableMatComponent.CHIPS
      default:
        return 'inputField'
    }
  }
}
