import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FormField } from '../../../formdata/model/form-field.model'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { AbstractFormComponent } from '../../../common/component/abstract-form.component'
import { takeUntil } from 'rxjs'
import { EditFormConfigTabComponent } from './edit-form-config-tab/edit-form-config-tab.component'
import { EditFormValueTabComponent } from './edit-form-value-tab/edit-form-value-tab.component'
import { EditFormFieldTabComponent } from './edit-form-field-tab/edit-form-field-tab.component'

@Component({
  selector: 'app-edit-form-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCardActions,
    MatCard,
    MatCardHeader,
    MatIconButton,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatTabGroup,
    MatTab,
    EditFormValueTabComponent,
    EditFormConfigTabComponent,
    EditFormFieldTabComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-form-field.component.html',
  styleUrl: './edit-form-field.component.css',
})
export class EditFormFieldComponent extends AbstractFormComponent<FormField> {
  fb = inject(FormBuilder)

  @Input() inCreationMode: boolean = false
  @Output() save = new EventEmitter<FormField>()
  @Output() remove = new EventEmitter<void>()
  @Output() close = new EventEmitter<FormField>()

  _formGroup: FormGroup<ReactiveForm<FormField>>
  override successMessage = 'The form field was saved successfully.'

  override valueChangesSubscription() {
    return this._formGroup.controls.componentType.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      // reset default value to avoid parsing errors
      this._formGroup.controls.defaultValue.reset()
    })
  }
}
