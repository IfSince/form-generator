import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { EditFormFieldComponent } from '../edit-form-field/edit-form-field.component'
import { takeUntil } from 'rxjs'
import { MaterialFieldComponent } from '../form-fields/material-field/material-field.component'
import { FormDataFormBuilderService } from '../../../formdata/service/form-data-form-builder.service'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FieldType, FormField, MaterialComponentType } from '../../../formdata/model/form-field.model'
import { getFieldsAsFlatList } from '../../get-fields-as-flat-list'
import { SelectableFormFieldComponent } from '../form-fields/selectable-form-field/selectable-form-field.component'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatIcon } from '@angular/material/icon'
import { NgStyle } from '@angular/common'
import { AbstractFormComponent } from '../../../common/component/abstract-form.component'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatOption } from '@angular/material/core'
import { MatSelect } from '@angular/material/select'

export const Breakpoints = [
  { name: 'XSmall', width: '600px'},
  { name: 'Small', width: '960px'},
  { name: 'Medium', width: '1280px'},
  { name: 'Large', width: '1920px'},
  { name: 'Full', width: '100%'},
]

@Component({
  selector: 'app-preview-form',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    ReactiveFormsModule,
    EditFormFieldComponent,
    MatButton,
    SelectableFormFieldComponent,
    MaterialFieldComponent,
    SelectableFormFieldComponent,
    SelectableFormFieldComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    NgStyle,
    MatCardSubtitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
  ],
  templateUrl: './preview-form.component.html',
  styleUrl: './preview-form.component.css',
})
export class PreviewFormComponent extends AbstractFormComponent<{ entries: FormField[] }> implements OnInit {
  protected readonly FieldType = FieldType
  private formDataFormBuilderService = inject(FormDataFormBuilderService)

  @Output() select = new EventEmitter()

  _formGroup: FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }>
  breakpointControl = new FormControl('100%')

  selectedField = signal<FormGroup<ReactiveForm<FormField>> | null>(null)
  flattenedFields = signal<FormGroup<ReactiveForm<FormField>>[]>([])

  ngOnInit(): void {
    this.flattenedFields.set(getFieldsAsFlatList(this._formGroup.controls.entries))

    this.selectedField.set(this.flattenedFields()[0])
  }

  override setValueChangesSubscription() {
    return this._formGroup.controls.entries.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.flattenedFields.set(getFieldsAsFlatList(this._formGroup.controls.entries))
    })
  }

  updateField(updatedField: FormField) {
    const index = this.flattenedFields().indexOf(this.selectedField())
    const control = this.formDataFormBuilderService.buildFormField(updatedField)

    index != -1
      ? this.selectedField().patchValue(updatedField, { emitEvent: false })
      : this._formGroup.controls.entries.push(control)

    // unfortunately patchValue does not override the formArrays itself but only the underlying form controls, which is why we have to override it manually every time the length changes (created/deleted)
    if (updatedField.fieldSelectOptions?.length !== this.selectedField().getRawValue().fieldSelectOptions?.length) {
      this.selectedField().controls.fieldSelectOptions.clear({ emitEvent: false })
      updatedField.fieldSelectOptions.forEach(option => {
        this.selectedField().controls.fieldSelectOptions.push(this.formDataFormBuilderService.buildFieldSelectOptionFormGroup(option), { emitEvent: false })
      })
    }

    this.selectedField.set(null)
  }

  addField() {
    const newField: FormField = {
      name: '',
      label: '',
      fieldType: FieldType.STRING,
      componentType: MaterialComponentType.TEXT,
      fields: [],
      required: false,
      readonly: false,
      disabled: false,
      hidden: false,
      defaultValue: null,
    }

    this.selectedField.set(this.formDataFormBuilderService.buildFormField(newField))
  }

  removeSelectedField() {
    const parent = this.selectedField().parent

    if (parent instanceof FormArray) {
      const index = parent.controls.indexOf(this.selectedField())

      if (index != -1) {
        parent.removeAt(index)
        this.checkAndRemoveParentIfEmpty(parent)
      }
    }

    this.selectedField.set(null)
  }

  private checkAndRemoveParentIfEmpty(parentArray: FormArray) {
    if (parentArray.controls.length === 0) {
      const grandParentArray = parentArray.parent?.parent
      if (grandParentArray instanceof FormArray) {
        const index = grandParentArray.controls.indexOf(parentArray.parent)

        if (index != -1) {
          grandParentArray.removeAt(index)
          this.checkAndRemoveParentIfEmpty(grandParentArray)
        }
      }
    }
  }

  protected readonly Breakpoints = Breakpoints
}
