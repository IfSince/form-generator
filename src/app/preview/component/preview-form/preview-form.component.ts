import { Component, EventEmitter, inject, OnChanges, OnInit, Output, signal } from '@angular/core'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { EditFormFieldComponent } from '../edit-form-field/edit-form-field.component'
import { MaterialFieldComponent } from '../form-fields/material-field/material-field.component'
import { FormDataFormBuilderService } from '../../../formdata/service/form-data-form-builder.service'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { FieldType, FormField, MaterialComponentType } from '../../../formdata/model/form-field.model'
import { getFieldsAsFlatList } from '../../get-fields-as-flat-list'
import { SelectableFormFieldComponent } from '../form-fields/selectable-form-field/selectable-form-field.component'
import { MatIcon } from '@angular/material/icon'
import { AbstractFormComponent } from '../../../common/component/abstract-form.component'
import { RouterLink } from '@angular/router'
import { filter, pairwise } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'

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
    MatIcon,
    MatCardSubtitle,
    RouterLink,
  ],
  templateUrl: './preview-form.component.html',
  styleUrl: './preview-form.component.css',
})
export class PreviewFormComponent extends AbstractFormComponent<{ entries: FormField[] }> implements OnInit, OnChanges {
  protected readonly FieldType = FieldType
  private formDataFormBuilderService = inject(FormDataFormBuilderService)

  @Output() select = new EventEmitter()

  _formGroup: FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }>

  flattenedFields = signal<FormGroup<ReactiveForm<FormField>>[]>([])
  selectedField = signal<FormGroup<ReactiveForm<FormField>> | null>(null)
  inCreationMode = signal(false)
  previousRawValue: FormField = null

  constructor() {
    super()

    toObservable(this.selectedField).pipe(
      pairwise(),
      filter(([prev, curr]) => prev?.getRawValue().name !== curr?.getRawValue().name)
    ).subscribe(([prevSelectedField, currSelectedField]) => {
      if (prevSelectedField != null && currSelectedField != null) {
        this.resetFormField(prevSelectedField)

        // only possible if new field was added instead of different selection, because name is required and cant be saved as null
        if (currSelectedField.getRawValue().name == null) {
          this.inCreationMode.set(true)
        } else {
          this.inCreationMode.set(false)
        }
      }
      this.previousRawValue = currSelectedField?.getRawValue()
    })
  }

  ngOnInit(): void {
    this.flattenedFields.set(getFieldsAsFlatList(this._formGroup.controls.entries))
  }

  ngOnChanges(): void {
    this.flattenedFields.set(getFieldsAsFlatList(this._formGroup.controls.entries))
  }

  addField() {
    const newField: FormField = {
      name: null,
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
    const newFieldControl = this.formDataFormBuilderService.buildFormField(newField)

    this.inCreationMode.set(true)
    this.selectedField.set(newFieldControl)
  }

  removeSelectedField() {
    const parent = this.selectedField().parent

    if (parent instanceof FormArray) {
      const index = parent.controls.indexOf(this.selectedField())

      if (index != -1) {
        parent.removeAt(index)
        this.removeParentIfEmpty(parent)
      }
    }

    if (!this.inCreationMode()) {
      this.globalMessageStore.addSuccess('The field was removed successfully.')
    }
    this.saveFormDataAndResetEditing()
  }

  onClose() {
    this.resetFormField()
    this.inCreationMode.set(false)
    this.selectedField.set(null)
  }

  protected saveFormDataAndResetEditing() {
    if (this.inCreationMode()) {
      this._formGroup.controls.entries.push(this.selectedField())
    }

    this.onSubmit(false, 'none')
    this.inCreationMode.set(false)
    this.selectedField.set(null)
  }

  private resetFormField(formField = this.selectedField()) {
    formField.patchValue(this.previousRawValue)

    // patchValue does not override the formArrays itself but only the underlying matching form controls, which is why we have to override it manually every time the length changes (created/deleted)
    if (this.previousRawValue.fieldSelectOptions?.length !== formField.getRawValue().fieldSelectOptions?.length) {
      formField.controls.fieldSelectOptions.clear({ emitEvent: false })
      this.previousRawValue.fieldSelectOptions.forEach(option => {
        formField.controls.fieldSelectOptions.push(this.formDataFormBuilderService.buildFieldSelectOptionFormGroup(option), { emitEvent: false })
      })
    }
  }

  private removeParentIfEmpty(parentArray: FormArray) {
    if (parentArray.controls.length === 0) {
      const grandParentArray = parentArray.parent?.parent
      if (grandParentArray instanceof FormArray) {
        const index = grandParentArray.controls.indexOf(parentArray.parent)

        if (index != -1) {
          grandParentArray.removeAt(index)
          this.removeParentIfEmpty(grandParentArray)
        }
      }
    }
  }
}
