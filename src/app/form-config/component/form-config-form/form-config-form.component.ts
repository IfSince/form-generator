import { Component, computed, OnInit, Signal, signal } from '@angular/core'
import { takeUntil } from 'rxjs'
import { FormConfig } from '../../model/form-config.model'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { DatePipe, JsonPipe } from '@angular/common'
import { MatAnchor } from '@angular/material/button'
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import {
  MatList,
  MatListItem,
  MatListItemIcon,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
  MatListOption,
  MatListSubheaderCssMatStyler,
  MatSelectionList,
} from '@angular/material/list'
import { MatFormField } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { DropzoneCdkModule, FileInputValidators, FileInputValue } from '@ngx-dropzone/cdk'
import { CustomDropzoneComponent } from '../../../common/component/custom-dropzone/custom-dropzone.component'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { AbstractFormComponent } from '../../../common/component/abstract-form.component'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'

@Component({
  selector: 'app-form-config-form',
  standalone: true,
  imports: [
    DatePipe,
    MatAnchor,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemIcon,
    MatListItemLine,
    MatListItemTitle,
    MatListOption,
    MatListSubheaderCssMatStyler,
    MatSelectionList,
    MatCardActions,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    DropzoneCdkModule,
    CustomDropzoneComponent,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatListItemMeta,
    JsonPipe,
  ],
  templateUrl: './form-config-form.component.html',
})
export class FormConfigFormComponent extends AbstractFormComponent<FormConfig> implements OnInit {
  folders = [
    { name: 'Photos', updated: new Date('1/1/16') },
    { name: 'Recipes', updated: new Date('1/17/16') },
    { name: 'Work', updated: new Date('1/28/16') },
  ]

  notes = [
    { name: 'Vacation Itinerary', updated: new Date('2/20/16') },
    { name: 'Kitchen Remodel', updated: new Date('1/18/16') },
  ]

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers']

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
        console.log('Form invalid or value is not instance of File')
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
    if (file.type !== 'application/json') {
      console.error('Die ausgewählte Datei ist keine gültige JSON-Datei.')
      this.file.setValue(null, { emitEvent: false })
      return
    }

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const parsedData = JSON.parse(e.target?.result as string)

        if (this.isFormConfig(parsedData)) {
          this._formGroup.setValue(parsedData)
          console.log('Importierte Daten:', this.jsonData())
        } else {
          console.log('Die übergebenen Daten stimmen nicht mit der Struktur von FormConfig überein und konnte nicht eingelesen werden')
          this.file.setValue(null, { emitEvent: false })
        }
      } catch (error) {
        console.error('Fehler beim Parsen der JSON-Datei:', error)
        this.file.setValue(null, { emitEvent: false })
      }
    }
    reader.readAsText(file)
  }

  private isFormConfig(data: any): data is FormConfig {
    return data && typeof data.test === 'string'
  }
}
