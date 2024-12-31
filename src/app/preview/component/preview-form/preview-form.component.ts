import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { EditFormFieldComponent } from '../edit-form-field/edit-form-field.component'
import { Subject, takeUntil } from 'rxjs'
import { MaterialFieldComponent } from '../form-fields/material-field/material-field.component'
import { CustomFormData } from '../../../formdata/model/custom-form-data.model'
import { FormDataFormBuilderService } from '../../../formdata/service/form-data-form-builder.service'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FieldType, FormField } from '../../../formdata/model/form-field.model'
import { getFieldsAsFlatList } from '../../get-fields-as-flat-list'
import { SelectableFormFieldComponent } from '../form-fields/selectable-form-field/selectable-form-field.component'
import { MatDivider } from '@angular/material/divider'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatIcon } from '@angular/material/icon'
import { NgStyle } from '@angular/common'

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
    MatDivider,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    NgStyle,
    MatCardSubtitle,
  ],
  templateUrl: './preview-form.component.html',
  styleUrl: './preview-form.component.css',
})
export class PreviewFormComponent implements OnInit, OnDestroy {
  @Input() data: CustomFormData
  @Output() select = new EventEmitter()
  @Output() submitFields = new EventEmitter<FormField[]>()

  protected readonly FieldType = FieldType
  private formDataFormBuilderService = inject(FormDataFormBuilderService)
  private destroy$ = new Subject<void>()

  formGroup: FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }>
  windowSizeClassFormControl = new FormControl('100%')
  selectedField = signal<FormGroup<ReactiveForm<FormField>> | null>(null)
  flattenedFields = signal<FormGroup<ReactiveForm<FormField>>[]>([])

  ngOnInit(): void {
    this.formGroup = this.formDataFormBuilderService.buildFormData(this.data.fields)
    this.flattenedFields.set(getFieldsAsFlatList(this.formGroup.controls.entries))

    this.formGroup.controls.entries.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.flattenedFields.set(getFieldsAsFlatList(this.formGroup.controls.entries))
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  onSubmit() {
    this.formGroup.markAllAsTouched()
    this.formGroup.updateValueAndValidity()

    this.submitFields.emit(this.formGroup.getRawValue().entries)
  }

  updateField(updatedField: FormField) {
    const index = this.flattenedFields().indexOf(this.selectedField())

    index != -1
      ? this.selectedField().patchValue(updatedField)
      : this.formGroup.controls.entries.push(this.formDataFormBuilderService.buildFormField(updatedField))

    this.selectedField.set(null)
  }

  addField() {
    const newField: FormField = {
      name: '',
      fieldType: FieldType.STRING,
      fields: [],
      isRequired: false,
      isOptional: false,
      isReadonly: false,
      defaultValue: '',
      originalType: null,
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
}
