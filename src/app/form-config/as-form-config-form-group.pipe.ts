import { inject, Pipe, PipeTransform } from '@angular/core'
import { FormConfig } from './model/form-config.model'
import { FormConfigFormBuilderService } from './service/form-config-form-builder.service'
import { FormGroup } from '@angular/forms'
import { ReactiveForm } from '../formdata/model/reactive-form-control.model'

@Pipe({
  name: 'asFormConfigFormGroup',
  standalone: true,
})
export class AsFormConfigFormGroupPipe implements PipeTransform {
  private formConfigFormBuilderService = inject(FormConfigFormBuilderService)

  transform(data: FormConfig): FormGroup<ReactiveForm<FormConfig>> {
    return this.formConfigFormBuilderService.buildFormConfig(data)
  }
}
