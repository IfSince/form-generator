import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list'
import { AsyncPipe, Location } from '@angular/common'
import { MatButton } from '@angular/material/button'
import { FormConfigStore } from '../service/form-config.store'
import { FormConfigFormComponent } from '../component/form-config-form/form-config-form.component'
import { AsFormConfigFormGroupPipe } from '../as-form-config-form-group.pipe'
import { ClearDialogDirective } from '../../common/directive/clear-dialog.directive'
import { FormConfig } from '../model/form-config.model'

@Component({
  selector: 'app-configuration-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    AsyncPipe,
    FormConfigFormComponent,
    MatButton,
    AsFormConfigFormGroupPipe,
    ClearDialogDirective,
  ],
  templateUrl: './form-config.view.html',
})
export class FormConfigView {
  protected formConfigStore = inject(FormConfigStore)
  protected location = inject(Location)

  onSubmit(data: FormConfig): void {
    this.formConfigStore.updateState({ data })
  }

  onClear = () => this.formConfigStore.clearData()
}
