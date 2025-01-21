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
          const data = this.formDataCreateByTypeScriptService.create(inputString, selectedType)
          this.formDataStore.setState({ data })
          void this.router.navigate(['preview'])
        } else if (result === false) {
          void this.router.navigate(['preview'])
        }
      })
    } else {
      const data = this.formDataCreateByTypeScriptService.create(inputString, selectedType)
      this.formDataStore.setState({ data })
      void this.router.navigate(['preview'])
    }
  }

  onClear = () => this.formDataStore.clearData()
}
