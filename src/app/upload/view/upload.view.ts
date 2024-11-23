import { Component } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule } from '@angular/forms'
import { TypescriptInputComponent } from '../typescript-upload/typescript-input.component'
import { MatTab, MatTabGroup } from '@angular/material/tabs'

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
  onTypescriptInputSubmit(data: string | null) {
    // TODO add actual submit logic
    console.log(data)
  }
}
