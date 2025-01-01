import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormConfig } from '../model/form-config.model'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'

@Injectable({
  providedIn: 'root',
})
export class FormConfigFormBuilderService {

  constructor(private fb: FormBuilder) {
  }

  buildFormConfig(config: FormConfig): FormGroup<ReactiveForm<FormConfig>> {
    return this.fb.group({
      test: [config?.test],
    })
  }
}
