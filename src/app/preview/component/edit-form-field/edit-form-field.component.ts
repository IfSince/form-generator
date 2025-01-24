import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatCard, MatCardActions, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FormField, MaterialComponentType } from '../../../formdata/model/form-field.model'
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
export class EditFormFieldComponent extends AbstractFormComponent<FormField> implements OnChanges {
  fb = inject(FormBuilder)

  @Input() rawValue: FormField
  @Input() inCreationMode: boolean = false
  @Output() save = new EventEmitter<FormField>()
  @Output() remove = new EventEmitter<void>()
  @Output() close = new EventEmitter<FormField>()

  // reset unsaved changes in form when selecting a different one to avoid invalid form state
  ngOnChanges(changes: SimpleChanges): void {
    const previousFormGroup: FormGroup = changes['formGroup'].previousValue
    const currentValue = changes['rawValue'].currentValue
    const previousValue = changes['rawValue'].previousValue

    if (currentValue && previousValue && previousFormGroup.dirty) {
      previousFormGroup.setValue(previousValue)
    }
  }

  _formGroup: FormGroup<ReactiveForm<FormField>>
  override successMessage = 'The form field was saved successfully.'

  override valueChangesSubscription() {
    return this._formGroup.controls.componentType.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((componentType) => {
      // reset default value to avoid parsing errors
      this._formGroup.controls.defaultValue.reset()

      this.NON_READONLY_COMPONENT_TYPES.includes(componentType)
        ? this._formGroup.controls.readonly.disable()
        : this._formGroup.controls.readonly.enable()

      this.NON_HIDDEN_COMPONENT_TYPES.includes(componentType)
        ? this._formGroup.controls.hidden.disable()
        : this._formGroup.controls.hidden.enable()
    })
  }

  onRemove() {
    this.remove.emit()
  }

  onClose() {
    this.inCreationMode
      ? this.remove.emit()
      : this.close.emit(this.originalValue)
  }

  NON_READONLY_COMPONENT_TYPES = [
    MaterialComponentType.COLOR,
    MaterialComponentType.CHECKBOX,
    MaterialComponentType.SLIDER,
    MaterialComponentType.SLIDE_TOGGLE,
    MaterialComponentType.RADIO_BUTTON,
    MaterialComponentType.SELECT,
    MaterialComponentType.BUTTON_TOGGLE,
  ]

  NON_HIDDEN_COMPONENT_TYPES = [
    MaterialComponentType.CHECKBOX,
    MaterialComponentType.SLIDER,
    MaterialComponentType.SLIDE_TOGGLE,
    MaterialComponentType.RADIO_BUTTON,
    MaterialComponentType.SELECT,
    MaterialComponentType.BUTTON_TOGGLE,
  ]
}
