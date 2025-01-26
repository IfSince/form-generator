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
import { FormField } from '../../formdata/model/form-field.model'
import { AsFieldsFormGroupPipe } from '../../formdata/as-form-data-form-group.pipe'
import { ClearDialogDirective } from '../../common/directive/clear-dialog.directive'
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card'
import Handlebars from 'handlebars'
import { HttpClient } from '@angular/common/http'
import { forkJoin } from 'rxjs'
import { Clipboard } from '@angular/cdk/clipboard'
import { GlobalMessageStore } from '../../common/service/global-message.store'

@Component({
  selector: 'app-preview-view',
  standalone: true,
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
    MatCard,
    MatCardTitle,
    MatCardHeader,
  ],
  templateUrl: './preview.view.html',
})
export class PreviewView {
  protected formDataStore = inject(FormDataStore)
  private router = inject(Router)
  private httpClient = inject(HttpClient)
  private clipboard = inject(Clipboard)
  private globalMessageStore = inject(GlobalMessageStore)

  onSubmit(data: { entries: FormField[] }): void {
    this.formDataStore.updateState({ data: { ...this.formDataStore.state.data, fields: data.entries } })
  }

  onClear = () => {
    this.formDataStore.clearData()
    void this.router.navigate(['upload'])
  }

  generateCode() {
    const fields = this.formDataStore.state.data.fields

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
    }) => {
      Handlebars.registerPartial('inputField', inputFieldTemplate)
      Handlebars.registerPartial('textareaField', textareaTemplate)
      Handlebars.registerPartial('checkboxField', checkboxTemplate)
      Handlebars.registerPartial('slideToggleField', slideToggleTemplate)
      Handlebars.registerPartial('sliderField', sliderTemplate)
      Handlebars.registerPartial('datepickerField', datepickerTemplate)
      Handlebars.registerPartial('radioButtonField', radioButtonTemplate)
      Handlebars.registerPartial('selectField', selectTemplate)
      Handlebars.registerPartial('buttonToggleField', buttonToggleTemplate)

      const template = Handlebars.compile(formTemplate)
      const sourceCode = template({ fields })

      this.clipboard.copy(sourceCode)
      this.globalMessageStore.addSuccess('Source code copied to clipboard successfully.')

      console.log(sourceCode)
    })
  }
}
