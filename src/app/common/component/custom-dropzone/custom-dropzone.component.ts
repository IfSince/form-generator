import { Component, Input } from '@angular/core'
import { AcceptService, DropzoneCdkModule, DropzoneComponent, DropzoneService } from '@ngx-dropzone/cdk'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-dropzone',
  imports: [DropzoneCdkModule, MatButton],
  providers: [DropzoneService, AcceptService],
  standalone: true,
  templateUrl: './custom-dropzone.component.html',
})
export class CustomDropzoneComponent extends DropzoneComponent {
  @Input() text: string = 'Drag and drop your file here'

  onContainerClick() {
    this.openFilePicker();
  }
}
