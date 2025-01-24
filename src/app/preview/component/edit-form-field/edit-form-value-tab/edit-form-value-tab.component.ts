import { Component, inject, Input } from '@angular/core'
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { GetInputTypePipe } from '../../form-fields/material-field/get-input-type.pipe'
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { FormField, MaterialComponentType } from '../../../../formdata/model/form-field.model'
import { GetComponentToRenderPipe, RenderableMatComponent } from '../../form-fields/material-field/get-component-to-render'
import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatOption } from '@angular/material/core'
import { MatSelect } from '@angular/material/select'
import { ReactiveForm } from '../../../../formdata/model/reactive-form-control.model'
import { FieldSelectOption } from '../../../../formdata/model/form-field-select-option.model'
import { MatDialog } from '@angular/material/dialog'
import { AddOptionDialogComponent } from './add-option-dialog/add-option-dialog.component'

@Component({
  selector: 'app-edit-form-value-tab',
  standalone: true,
  imports: [
    FormsModule,
    GetInputTypePipe,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatOption,
    MatSelect,
    GetComponentToRenderPipe,
  ],
  templateUrl: './edit-form-value-tab.component.html',
  styleUrl: './edit-form-value-tab.component.css',
})
export class EditFormValueTabComponent {
  protected readonly MaterialComponentType = MaterialComponentType
  protected readonly RenderableMatComponent = RenderableMatComponent

  INPUT_COMPONENT_TYPES_WITHOUT_PLACEHOLDER = [
    MaterialComponentType.COLOR,
    MaterialComponentType.DATETIME_LOCAL,
    MaterialComponentType.TIME,
    MaterialComponentType.WEEK,
    MaterialComponentType.MONTH,
  ]

  CHECKABLE_TYPES = [MaterialComponentType.CHECKBOX, MaterialComponentType.SLIDE_TOGGLE]
  MULTISELECT_TYPES = [MaterialComponentType.SELECT, MaterialComponentType.BUTTON_TOGGLE]

  private fb = inject(FormBuilder)
  private dialog = inject(MatDialog)

  @Input() form: FormGroup<ReactiveForm<FormField>>

  constructor() {
    this.optionFormGroup = this.fb.group({
      displayName: this.fb.control(null, [Validators.required]),
      selectableValue: this.fb.control(null, [Validators.required]),
    })
  }

  optionFormGroup: FormGroup<ReactiveForm<FieldSelectOption>>

  openOptionDialog() {
    const dialogRef = this.dialog.open(AddOptionDialogComponent, {
      width: '350px',
      data: {
        currentOptions: this.form.getRawValue().fieldSelectOptions,
      },
    })
    dialogRef.afterClosed().subscribe((result: FieldSelectOption | undefined) => !!result && this.addToOptions(result))
  }

  removeOption(index: number) {
    this.form.controls.fieldSelectOptions.removeAt(index)
  }

  addToOptions(option: FieldSelectOption) {
    const group = this.fb.group({
      displayName: [option.displayName],
      selectableValue: [option.selectableValue],
    })
    this.form.controls.fieldSelectOptions.push(group)
  }
}
