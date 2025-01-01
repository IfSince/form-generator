import { inject, Pipe, PipeTransform } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { FormDataFormBuilderService } from './service/form-data-form-builder.service'
import { FormField } from './model/form-field.model'
import { ReactiveForm } from './model/reactive-form-control.model'

@Pipe({
  name: 'asFieldsFormGroup',
  standalone: true,
})
export class AsFieldsFormGroupPipe implements PipeTransform {
  private formDataFormBuilderService = inject(FormDataFormBuilderService)

  transform(fields?: FormField[]): FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }> {
    return this.formDataFormBuilderService.buildFormData(fields)
  }
}
