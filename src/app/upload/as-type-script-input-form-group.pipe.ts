import { inject, Pipe, PipeTransform } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TypeScriptInput } from './component/typescript-upload/typescript-input.component'
import { ReactiveForm } from '../formdata/model/reactive-form-control.model'
import { CustomFormData } from '../formdata/model/custom-form-data.model'

@Pipe({
  name: 'asTypeScriptInputFormGroup',
  standalone: true
})
export class AsTypeScriptInputFormGroupPipe implements PipeTransform {
  private fb = inject(FormBuilder)

  transform(input?: CustomFormData): FormGroup<ReactiveForm<TypeScriptInput>> {
    return this.fb.group({
      text: [input?.originalText, Validators.required],
      selectedType: [input?.name, Validators.required],
    });
  }
}
