import { Component, inject } from '@angular/core'
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
import { AsFieldsFormGroupPipe } from '../../formdata/as-form-data-form-group.pipe'
import { ClearDialogDirective } from '../../common/directive/clear-dialog.directive'

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
    RouterLink,
    AsFieldsFormGroupPipe,
    MatAnchor,
    ClearDialogDirective,
  ],
  templateUrl: './preview.view.html',
})
export class PreviewView {
  protected formDataStore = inject(FormDataStore)

  onSubmit(data: { entries: FormField[] }): void {
    this.formDataStore.updateState({ data: { ...this.formDataStore.state.data, fields: data.entries } })
  }

  onClear = () => this.formDataStore.clearData()
}
