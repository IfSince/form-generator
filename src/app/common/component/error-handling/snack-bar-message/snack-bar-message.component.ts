import { Component, Inject, inject } from '@angular/core'
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-snack-bar-error-component',
  standalone: true,
  imports: [
    MatSnackBarLabel,
    MatSnackBarActions,
    MatButton,
    MatSnackBarAction,
  ],
  templateUrl: './snack-bar-message.component.html',
  styleUrl: './snack-bar-message.component.css'
})
export class SnackBarMessageComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}
