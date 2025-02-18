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
import { GetRawValuePipe } from '../../../common/get-raw-value.pipe'
import { pairwise } from 'rxjs'
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
    GetRawValuePipe,
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
    ).subscribe(([prev, curr]) => {
      // reset unsaved changes of previously selected field on selection of another field
      if (prev != null && curr != null) {
        prev.setValue(this.previousRawValue)
      }

      // remember originalValue to be able to reset
      if (curr != null) {
        this.previousRawValue = curr.getRawValue()
      }
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
    const newFieldControl = this.formDataFormBuilderService.buildFormField(newField)

    this._formGroup.controls.entries.push(newFieldControl)
    this.inCreationMode.set(true)
    this.selectedField.set(newFieldControl)
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

    if (!this.inCreationMode()) {
      this.globalMessageStore.addSuccess('The field was removed successfully.')
    }
    this.saveFormDataAndResetEditing()
  }

  onClose(originalField: FormField) {
    this.inCreationMode.set(false)
    this.selectedField().patchValue(originalField)

    // patchValue does not override the formArrays itself but only the underlying matching form controls, which is why we have to override it manually every time the length changes (created/deleted)
    if (originalField.fieldSelectOptions?.length !== this.selectedField().getRawValue().fieldSelectOptions?.length) {
      this.selectedField().controls.fieldSelectOptions.clear({ emitEvent: false })
      originalField.fieldSelectOptions.forEach(option => {
        this.selectedField().controls.fieldSelectOptions.push(this.formDataFormBuilderService.buildFieldSelectOptionFormGroup(option), { emitEvent: false })
      })
    }

    // this.updateField(originalField) // revert potential changes made
    this.selectedField.set(null)
  }

  protected saveFormDataAndResetEditing() {
    this.onSubmit(false, 'none')
    this.inCreationMode.set(false)
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
