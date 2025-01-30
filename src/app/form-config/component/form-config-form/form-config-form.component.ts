import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core'
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
import { FormConfigFormBuilderService } from '../../service/form-config-form-builder.service'

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
  private formConfigFormBuilderService = inject(FormConfigFormBuilderService)

  formFieldAppearanceOptions: FieldSelectOption[] = [
    { displayName: 'Fill', selectableValue: 'fill' },
    { displayName: 'Outline', selectableValue: 'outline' },
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
    this.jsonData.set(this.removeNullFields(this._formGroup.getRawValue()))

    this.file.valueChanges.subscribe(value => {
      if (this.file.valid && value instanceof File) {
        this.readJsonFile(value)
      } else {
        this.file.setValue(null, { emitEvent: false })
        this.globalMessageStore.addError('Only files of type json are allowed.')
      }
    })
  }

  override valueChangesSubscription() {
    return this._formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.jsonData.set(this.removeNullFields(this._formGroup.getRawValue()))
    })
  }

  private readJsonFile(file: File): void {
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string)

        if (this.isFormConfig(parsedData)) {
          this._formGroup.setValue(this.formConfigFormBuilderService.buildFormConfig(parsedData).getRawValue())
          this.onSubmit(false, 'none')
          this.globalMessageStore.addSuccess('The form data was imported successfully.')
        } else {
          this.globalMessageStore.addError('The imported json data could not be converted to form config.')
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
    const formConfigKeys: Record<keyof FormConfig, true> = {
      formFieldAppearance: true,
      hideRequiredMarker: true,
      floatLabel: true,
      subscriptSizing: true,
      disableRipple: true,
      disabledInteractive: true,
      labelPosition: true,
      hideSingleSelectionIndicator: true,
      panelClass: true,
      textareaAutosize: true,
      textareaMinRows: true,
      textareaMaxRows: true,
      sliderDiscrete: true,
      sliderShowTickMarks: true,
      slideToggleHideIcon: true,
      selectDisableOptionCentering: true,
      selectAddNullOption: true,
      datepickerRestoreFocus: true,
      datepickerTouchUi: true,
      buttonToggleHideMultiSelectionIndicator: true,
      buttonToggleAppearance: true,
    }
    const allowedKeys = new Set(Object.keys(formConfigKeys))
    return data != null && typeof data == 'object' && Object.keys(data).every(key => allowedKeys.has(key))
  }

  private removeNullFields(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNullFields(item)).filter(item => item !== null)
    }

    const cleanedObject: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = this.removeNullFields(obj[key])
        if (value !== null) {
          cleanedObject[key] = value
        }
      }
    }
    return cleanedObject
  }
}
