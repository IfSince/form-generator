import { Injectable } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormField } from '../model/form-field.model'
import { ReactiveForm } from '../model/reactive-form-control.model'
import { FieldSelectOption } from '../model/form-field-select-option.model'

@Injectable({
  providedIn: 'root'
})
export class FormDataFormBuilderService {

  constructor(
    private fb: FormBuilder,
  ) { }

  buildFormData(fields: FormField[]): FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }> {
    return this.fb.group({ entries: this.fb.array(fields.map(it => this.buildFormField(it))) })
  }

  buildFormField(field: FormField): FormGroup {
    return this.fb.group({
      name: [field.name, Validators.required],
      fieldType: [field.fieldType, Validators.required],
      isRequired: [field.isRequired],
      isOptional: [field.isOptional],
      isReadonly: [field.isReadonly],
      defaultValue: [field.defaultValue],
      options: this.fb.array(field.options?.map(option => this.createOptionFormGroup(option)) || []),

      fields: this.fb.array(field.fields?.map(field => this.buildFormField(field)) || []),

      originalType: [field.originalType],
    })
  }

  private createOptionFormGroup(option: FieldSelectOption): FormGroup {
    return this.fb.group({
      displayName: [option.displayName],
      value: [option.value],
    })
  }
}
