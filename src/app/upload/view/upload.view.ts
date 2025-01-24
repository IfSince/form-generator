import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { TypescriptInputComponent } from '../component/typescript-upload/typescript-input.component'
import { FormDataCreateByTypeScriptService } from '../../formdata/service/form-data-create-by-type-script.service'
import { FormDataStore } from '../../formdata/service/form-data.store'
import { MatButton } from '@angular/material/button'
import { AsyncPipe } from '@angular/common'
import { AsTypeScriptInputFormGroupPipe } from '../as-type-script-input-form-group.pipe'
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
    TypescriptInputComponent,
    MatButton,
    AsyncPipe,
    AsTypeScriptInputFormGroupPipe,
    MatIcon,
    ClearDialogDirective,
  ],
  templateUrl: './upload.view.html',
})
export class UploadView {
  private dialog = inject(MatDialog)
  private globalMessageStore = inject(GlobalMessageStore)

  constructor(
    private formDataCreateByTypeScriptService: FormDataCreateByTypeScriptService,
    protected formDataStore: FormDataStore,
    private router: Router,
  ) {
  }

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
