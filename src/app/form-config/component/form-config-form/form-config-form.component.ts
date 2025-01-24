import { Component, computed, OnInit, Signal, signal } from '@angular/core'
import { takeUntil } from 'rxjs'
import { FormConfig } from '../../model/form-config.model'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatAnchor } from '@angular/material/button'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatList, MatListItem, MatListItemLine, MatListItemMeta, MatListItemTitle, MatListSubheaderCssMatStyler } from '@angular/material/list'
import { MatFormField } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { DropzoneCdkModule, FileInputValidators, FileInputValue } from '@ngx-dropzone/cdk'
import { CustomDropzoneComponent } from '../../../common/component/custom-dropzone/custom-dropzone.component'
import { AbstractFormComponent } from '../../../common/component/abstract-form.component'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatCheckbox } from '@angular/material/checkbox'
import { ListItemButtonToggleComponent } from './list-item-button-toggle/list-item-button-toggle.component'
import { FieldSelectOption } from '../../../formdata/model/form-field-select-option.model'

@Component({
  selector: 'app-form-config-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatAnchor,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemLine,
    MatListItemTitle,
    MatListSubheaderCssMatStyler,
    MatCardActions,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    DropzoneCdkModule,
    CustomDropzoneComponent,
    MatListItemMeta,
    MatCardSubtitle,
    MatCheckbox,
    ListItemButtonToggleComponent,
  ],
  templateUrl: './form-config-form.component.html',
  styleUrls: ['./form-config-form.component.css'],
})
export class FormConfigFormComponent extends AbstractFormComponent<FormConfig> implements OnInit {
  formFieldAppearanceOptions: FieldSelectOption[] = [
    { displayName: 'Fill', selectableValue: 'outline' },
    { displayName: 'Outline', selectableValue: 'fill' },
  ]

  floatLabelOptions: FieldSelectOption[] = [
    { displayName: 'Always', selectableValue: 'always' },
    { displayName: 'Auto', selectableValue: 'auto' },
  ]

  subscriptSizingOptions: FieldSelectOption[] = [
    { displayName: 'Fixed', selectableValue: 'fixed' },
    { displayName: 'Dynamic', selectableValue: 'dynamic' },
  ]

  labelPositionOptions: FieldSelectOption[] = [
    { displayName: 'Before', selectableValue: 'before' },
    { displayName: 'After', selectableValue: 'after' },
  ]

  buttonToggleAppearanceOptions: FieldSelectOption[] = [
    { displayName: 'Standard', selectableValue: 'standard' },
    { displayName: 'Legacy', selectableValue: 'legacy' },
  ]

  _formGroup: FormGroup<ReactiveForm<FormConfig>>

  file = new FormControl<FileInputValue>(null, [FileInputValidators.accept('application/json')])

  jsonData = signal<FormConfig>(null)
  jsonBlob = computed(() => this.jsonData() ? new Blob([JSON.stringify(this.jsonData(), null, 2)], { type: 'text/json;charset=utf-8' }) : null)
  jsonBlobUrl: Signal<string> = computed(() => this.jsonBlob() ? window.URL.createObjectURL(this.jsonBlob()) : null)

  ngOnInit(): void {
    this.jsonData.set(this._formGroup.getRawValue())

    this.file.valueChanges.subscribe(value => {
      if (this.file.valid && value instanceof File) {
        this.readJsonFile(value)
      } else {
        this.file.setValue(null, { emitEvent: false })
        this.globalMessageStore.addError('An error occurred while trying to import the file.')
      }
    })
  }

  override valueChangesSubscription() {
    return this._formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.jsonData.set(this._formGroup.getRawValue())
    })
  }

  private readJsonFile(file: File): void {
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string)

        if (this.isFormConfig(parsedData)) {
          this._formGroup.setValue(parsedData)
          this.onSubmit(false, 'none')
          this.globalMessageStore.addSuccess('The form data was imported successfully.')
        } else {
          this.globalMessageStore.addError('The uploaded data does not match the structure of form data and therefore was not imported.')
          this.file.setValue(null, { emitEvent: false })
        }
      } catch (error) {
        this.globalMessageStore.addError('An error occurred while trying to import the file.')
        this.file.setValue(null, { emitEvent: false })
      }
    }
    reader.readAsText(file)
  }

  private isFormConfig(data: any): data is FormConfig {
    return data != null && typeof data == 'object'
  }
}
