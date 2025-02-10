import { Component, inject } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatAnchor, MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { AsyncPipe } from '@angular/common'
import { PreviewFormComponent } from '../component/preview-form/preview-form.component'
import { FormDataStore } from '../../formdata/service/form-data.store'
import { FormField, MATERIAL_INPUT_COMPONENT_TYPES, MaterialComponentType } from '../../formdata/model/form-field.model'
import { AsFieldsFormGroupPipe } from '../../formdata/as-form-data-form-group.pipe'
import { ClearDialogDirective } from '../../common/directive/clear-dialog.directive'
import Handlebars from 'handlebars'
import { HttpClient } from '@angular/common/http'
import { forkJoin } from 'rxjs'
import { Clipboard } from '@angular/cdk/clipboard'
import { GlobalMessageStore } from '../../common/service/global-message.store'
import { GetInputTypePipe } from '../component/form-fields/material-field/get-input-type.pipe'
import { FormDataFormBuilderService } from '../../formdata/service/form-data-form-builder.service'

@Component({
  selector: 'app-preview-view',
  standalone: true,
  providers: [GetInputTypePipe],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatIcon,
    AsyncPipe,
    PreviewFormComponent,
    RouterLink,
    AsFieldsFormGroupPipe,
    MatAnchor,
    ClearDialogDirective,
  ],
  templateUrl: './preview.view.html',
})
export class PreviewView {
  protected formDataStore = inject(FormDataStore)
  private router = inject(Router)
  private httpClient = inject(HttpClient)
  private clipboard = inject(Clipboard)
  private globalMessageStore = inject(GlobalMessageStore)
  private getInputTypePipe = inject(GetInputTypePipe)
  private formDataFormBuilderService = inject(FormDataFormBuilderService)

  onSubmit(data: { entries: FormField[] }): void {
    this.formDataStore.updateState({ data: { ...this.formDataStore.state.data, fields: data.entries } })
  }

  onClear = () => {
    this.formDataStore.clearData()
    void this.router.navigate(['upload'])
  }

  generateCode() {
    const fields: FormField[] = this.formDataStore.state.data.fields.map(field => {
      return this.formDataFormBuilderService.buildFormField(field).getRawValue()
    })

    forkJoin({
      formTemplate: this.httpClient.get('templates/form.hbs', { responseType: 'text' }),
      inputFieldTemplate: this.httpClient.get('templates/input.hbs', { responseType: 'text' }),
      textareaTemplate: this.httpClient.get('templates/textarea.hbs', { responseType: 'text' }),
      checkboxTemplate: this.httpClient.get('templates/checkbox.hbs', { responseType: 'text' }),
      slideToggleTemplate: this.httpClient.get('templates/slide-toggle.hbs', { responseType: 'text' }),
      sliderTemplate: this.httpClient.get('templates/slider.hbs', { responseType: 'text' }),
      datepickerTemplate: this.httpClient.get('templates/datepicker.hbs', { responseType: 'text' }),
      radioButtonTemplate: this.httpClient.get('templates/radio-button.hbs', { responseType: 'text' }),
      selectTemplate: this.httpClient.get('templates/select.hbs', { responseType: 'text' }),
      buttonToggleTemplate: this.httpClient.get('templates/button-toggle.hbs', { responseType: 'text' }),
      wrapperTemplate: this.httpClient.get('templates/wrapper.hbs', { responseType: 'text' }),
    }).subscribe(({
      formTemplate,
      inputFieldTemplate,
      textareaTemplate,
      checkboxTemplate,
      sliderTemplate,
      slideToggleTemplate,
      datepickerTemplate,
      radioButtonTemplate,
      selectTemplate,
      buttonToggleTemplate,
      wrapperTemplate
    }) => {
      Handlebars.registerHelper('isDefined', (value: any) => value != null && value != '')
      Handlebars.registerHelper('inputType', (value: MaterialComponentType) => this.getInputTypePipe.transform(value))
      Handlebars.registerHelper('getComponentTemplate', (componentType: MaterialComponentType) => this.getComponentToRender(componentType))

      Handlebars.registerPartial('inputField', inputFieldTemplate)
      Handlebars.registerPartial('textareaField', textareaTemplate)
      Handlebars.registerPartial('checkboxField', checkboxTemplate)
      Handlebars.registerPartial('slideToggleField', slideToggleTemplate)
      Handlebars.registerPartial('sliderField', sliderTemplate)
      Handlebars.registerPartial('datepickerField', datepickerTemplate)
      Handlebars.registerPartial('radioButtonField', radioButtonTemplate)
      Handlebars.registerPartial('selectField', selectTemplate)
      Handlebars.registerPartial('buttonToggleField', buttonToggleTemplate)
      Handlebars.registerPartial('wrapperField', wrapperTemplate)

      const template = Handlebars.compile(formTemplate)
      const sourceCode = template({ fields })

      this.clipboard.copy(sourceCode)
      this.globalMessageStore.addSuccess('Source code copied to clipboard.')
    })
  }



  private getComponentToRender(matComponentType: MaterialComponentType): string {
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
      case matComponentType === null:
        return 'wrapperField'
      default:
        return 'inputField'
    }
  }
}
