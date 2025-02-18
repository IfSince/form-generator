import { inject, Pipe, PipeTransform } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TypeScriptInput } from './component/upload-form/upload-form.component'
import { ReactiveForm } from '../formdata/model/reactive-form-control.model'
import { CustomFormData } from '../formdata/model/custom-form-data.model'

@Pipe({
  name: 'asTypeDefinitionFormGroup',
  standalone: true
})
export class AsTypeDefinitionFormGroupPipe implements PipeTransform {
  private fb = inject(FormBuilder)

  transform(input?: CustomFormData): FormGroup<ReactiveForm<TypeScriptInput>> {
    return this.fb.group({
      typeDefinition: [input?.typeDefinition, Validators.required],
      selectedType: [input?.selectedType, Validators.required],
    });
  }
}
