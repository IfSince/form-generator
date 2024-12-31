import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatOption } from '@angular/material/core'
import { MatSelect } from '@angular/material/select'

import { MatCheckbox } from '@angular/material/checkbox'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { FormDataFormBuilderService } from '../../../formdata/service/form-data-form-builder.service'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FieldType, FormField } from '../../../formdata/model/form-field.model'
import { MatDivider } from '@angular/material/divider'

@Component({
  selector: 'app-edit-form-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatCheckbox,
    MatButton,
    MatCardContent,
    MatCardActions,
    MatCard,
    MatCardHeader,
    MatIconButton,
    MatIcon,
    MatCardTitle,
    MatDivider,
  ],
  templateUrl: './edit-form-field.component.html',
  styleUrl: './edit-form-field.component.css',
})
export class EditFormFieldComponent {
  formDataFormBuilderService = inject(FormDataFormBuilderService)

  // necessary if saving needs to be additional step, otherwise just use formFieldFormGroup and remove _control
  @Input() set formFieldFormGroup(value: FormGroup<ReactiveForm<FormField>>) {
    this._control = this.formDataFormBuilderService.buildFormField(value.getRawValue())
  }

  @Output() save = new EventEmitter<FormField>()
  @Output() remove = new EventEmitter<void>()
  @Output() close = new EventEmitter<void>()

  fieldTypes = Object.values(FieldType)
  _control: FormGroup<ReactiveForm<FormField>>

  onSave() {
    this.save.emit(this._control.getRawValue())
  }
}
