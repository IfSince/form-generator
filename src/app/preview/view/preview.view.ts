import { Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatAnchor, MatButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { AsyncPipe } from '@angular/common'
import { PreviewFormComponent } from '../component/preview-form/preview-form.component'
import { FormDataStore } from '../../formdata/service/form-data.store'
import { FormField } from '../../formdata/model/form-field.model'

@Component({
  selector: 'app-preview-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatIcon,
    AsyncPipe,
    PreviewFormComponent,
    MatAnchor,
    RouterLink,
  ],
  templateUrl: './preview.view.html',
  styleUrl: './preview.view.css',
})
export class PreviewView {
  constructor(protected formDataStore: FormDataStore) {
  }

  onSubmit(fields: FormField[]): void {
    this.formDataStore.updateState({ data: { ...this.formDataStore.state.data, fields } })
  }

  onCancel(): void {
    this.formDataStore.updateState({ data: null })
  }
}
