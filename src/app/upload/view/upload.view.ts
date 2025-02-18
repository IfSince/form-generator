import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { UploadFormComponent } from '../component/upload-form/upload-form.component'
import { FormDataCreateByTypeScriptService } from '../../formdata/service/form-data-create-by-type-script.service'
import { FormDataStore } from '../../formdata/service/form-data.store'
import { MatButton } from '@angular/material/button'
import { AsyncPipe } from '@angular/common'
import { AsTypeDefinitionFormGroupPipe } from '../as-type-definition-form-group.pipe'
import { MatIcon } from '@angular/material/icon'
import { ClearDialogDirective } from '../../common/directive/clear-dialog.directive'
import { DialogComponent } from '../../common/component/clear-dialog/dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { GlobalMessageStore } from '../../common/service/global-message.store'

@Component({
  selector: 'app-upload-view',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    UploadFormComponent,
    MatButton,
    AsyncPipe,
    AsTypeDefinitionFormGroupPipe,
    MatIcon,
    ClearDialogDirective,
  ],
  templateUrl: './upload.view.html',
})
export class UploadView {
  protected formDataStore = inject(FormDataStore)
  private dialog = inject(MatDialog)
  private globalMessageStore = inject(GlobalMessageStore)
  private formDataCreateByTypeScriptService = inject(FormDataCreateByTypeScriptService)
  private router = inject(Router)

  onSubmit(inputString: string, selectedType: string) {
    // Show dialog when an active process already exists that would be overridden
    if (this.formDataStore.state.data != null) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        data: {
          title: 'Careful',
          text: 'There is already an active process. Do you want to re-generate and lose the previous changes, or just continue to the preview?',
          denyText: 'Continue',
          confirmText: 'Re-generate',
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.setFormData(inputString, selectedType, 'The form data was re-generated successfully.')
        } else if (result === false) {
          void this.router.navigate(['preview'])
        }
      })
    } else {
      this.setFormData(inputString, selectedType, 'The form data was created successfully.')
    }
  }

  setFormData(inputString: string, selectedType: string, message: string) {
    const data = this.formDataCreateByTypeScriptService.create(inputString, selectedType)
    this.formDataStore.setState({ data })
    this.globalMessageStore.addSuccess(message)
    void this.router.navigate(['preview'])
  }

  onClear = () => this.formDataStore.clearData()
}
