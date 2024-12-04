import { Component, computed, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule } from '@angular/forms'
import { TypescriptInputComponent } from '../typescript-upload/typescript-input.component'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { FormDataStore } from '../../formdata/form-data.store'
import { CustomFormData, InputType } from '../../formdata/model/form-data.model'
import { FormDataCreateByTypeScriptService } from '../../formdata/form-data-create-by-type-script.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-upload-view',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    TypescriptInputComponent,
    MatTabGroup,
    MatTab,
  ],
  templateUrl: './upload.view.html',
})
export class UploadView {

  selectedTabIndex = signal(0)
  selectedInputType = computed(() => [
      InputType.TYPESCRIPT,
      InputType.MANUAL_INPUT,
      InputType.FILE_UPLOAD,
    ][this.selectedTabIndex()],
  )

  constructor(
    private formDataCreateByTypeScriptService: FormDataCreateByTypeScriptService,
    private formDataStore: FormDataStore,
    private router: Router
  ) {
  }

  onSubmit(inputString: string, selectedType?: string) {
    const createData: Record<InputType, CustomFormData> = {
      [InputType.TYPESCRIPT]: this.formDataCreateByTypeScriptService.create(inputString, selectedType),
      [InputType.MANUAL_INPUT]: { inputType: InputType.MANUAL_INPUT } as CustomFormData,
      [InputType.FILE_UPLOAD]: { inputType: InputType.TYPESCRIPT } as CustomFormData,
    }

    const data = createData[this.selectedInputType()]

    this.formDataStore.setState({ data })
    void this.router.navigate(['preview'])
  }
}
