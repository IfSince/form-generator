import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatOptgroup, MatOption, provideNativeDateAdapter } from '@angular/material/core'
import { MatSelect } from '@angular/material/select'

import { MatCheckbox } from '@angular/material/checkbox'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FieldType, FormField, MaterialComponentType } from '../../../formdata/model/form-field.model'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { FieldSelectOption } from '../../../formdata/model/form-field-select-option.model'
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker'
import { GetComponentToRenderPipe, RenderableMatComponent } from '../form-fields/material-field/get-component-to-render'
import { GetInputTypePipe } from '../form-fields/material-field/get-input-type.pipe'
import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio'

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
    MatCardSubtitle,
    MatTabGroup,
    MatTab,
    MatSuffix,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatOptgroup,
    GetInputTypePipe,
    CdkTextareaAutosize,
    GetComponentToRenderPipe,
    MatRadioButton,
    MatRadioGroup,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-form-field.component.html',
  styleUrl: './edit-form-field.component.css',
})
export class EditFormFieldComponent {
  fb = inject(FormBuilder)
  optionFormGroup: FormGroup<ReactiveForm<FieldSelectOption>>

  constructor() {
    this.optionFormGroup = this.fb.group({
      displayName: this.fb.control(null, [Validators.required]),
      selectableValue: this.fb.control(null, [Validators.required]),
    })
  }

  addToOptions() {
    this.optionFormGroup.updateValueAndValidity()

    const value = this.optionFormGroup.getRawValue().selectableValue

    if (this._control.getRawValue().fieldSelectOptions.find(option => option.selectableValue === value) != null) {
      console.log('Values müssen unique sein')
      return
    }

    if (this.optionFormGroup.valid) {
      const rawValue = this.optionFormGroup.getRawValue()
      const group = this.fb.group({
        displayName: [rawValue.displayName],
        selectableValue: [rawValue.selectableValue],
      })

      this._control.controls.fieldSelectOptions.push(group)
      this.optionFormGroup.reset()
    } else {
      console.log('Invalid')
    }
  }

  removeOption(index: number) {
    this._control.controls.fieldSelectOptions.removeAt(index)
  }

  // necessary if saving needs to be additional step, otherwise just use formFieldFormGroup and remove _control
  @Input() set formFieldFormGroup(value: FormGroup<ReactiveForm<FormField>>) {
    this._control = value
  }

  @Output() save = new EventEmitter<FormField>()
  @Output() remove = new EventEmitter<void>()
  @Output() close = new EventEmitter<void>()

  _control: FormGroup<ReactiveForm<FormField>>

  protected readonly noPlaceholder = [
    MaterialComponentType.COLOR,

    MaterialComponentType.CHECKBOX,
    MaterialComponentType.SLIDE_TOGGLE,
    MaterialComponentType.BUTTON_TOGGLE,
    // MaterialComponentType.CHIPS,

    MaterialComponentType.TEXTAREA,
    MaterialComponentType.SLIDER,

    // MaterialComponentType.SELECT,
    MaterialComponentType.RADIO_BUTTON,

    MaterialComponentType.DATE,
    MaterialComponentType.DATETIME_LOCAL,
    MaterialComponentType.TIME,
    MaterialComponentType.WEEK,
    MaterialComponentType.MONTH,
  ]

  protected readonly noDefault = [
    MaterialComponentType.TEXTAREA,
    MaterialComponentType.SELECT,
    MaterialComponentType.RADIO_BUTTON,

    MaterialComponentType.CHECKBOX,
    MaterialComponentType.SLIDE_TOGGLE,
    MaterialComponentType.BUTTON_TOGGLE,
    // MaterialComponentType.CHIPS,

    MaterialComponentType.DATE,
  ]

  protected readonly Object = Object
  protected readonly MaterialComponentType = MaterialComponentType

  readonly materialComponentOptGroups = [
    {
      groupName: 'String',
      components: [
        MaterialComponentType.TEXT,
        MaterialComponentType.TEXTAREA,
        MaterialComponentType.EMAIL,
        MaterialComponentType.COLOR,
        MaterialComponentType.PASSWORD,
        MaterialComponentType.TELEPHONE,
        MaterialComponentType.URL,
      ],
    },
    {
      groupName: 'Number',
      components: [
        MaterialComponentType.NUMBER,
        MaterialComponentType.SLIDER,
      ],
    },
    {
      groupName: 'Boolean',
      components: [
        MaterialComponentType.CHECKBOX,
        MaterialComponentType.SLIDE_TOGGLE,
      ],
    },
    {
      groupName: 'Enum',
      components: [
        MaterialComponentType.SELECT,
        MaterialComponentType.RADIO_BUTTON,
      ],
    },
    {
      groupName: 'Date / Time',
      components: [
        MaterialComponentType.DATE,
        MaterialComponentType.DATETIME_LOCAL,
        MaterialComponentType.TIME,
        MaterialComponentType.WEEK,
        MaterialComponentType.MONTH,
      ],
    },
    {
      groupName: 'Array',
      components: [
        MaterialComponentType.BUTTON_TOGGLE,
        // MaterialComponentType.CHIPS,
      ]
    },
  ]
  protected readonly RenderableMatComponent = RenderableMatComponent
}
