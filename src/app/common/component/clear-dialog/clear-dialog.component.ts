import { Component, inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'
import { FormsModule } from '@angular/forms'

interface ClearDialog {
  title: string
  text: string
}

@Component({
  selector: 'app-form-config-clear-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    FormsModule,

  ],
  templateUrl: './clear-dialog.component.html',
  styleUrl: './clear-dialog.component.css',
})
export class ClearDialogComponent {
  data = inject<ClearDialog>(MAT_DIALOG_DATA)
}
