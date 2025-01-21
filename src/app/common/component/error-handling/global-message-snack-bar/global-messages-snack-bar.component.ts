import { Component, inject } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { SnackBarMessageComponent } from '../snack-bar-message/snack-bar-message.component'
import { GlobalMessageStore } from '../../../service/global-message.store'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { filter } from 'rxjs'

@Component({
  selector: 'app-global-error-snack-bar',
  standalone: true,
  template: '',
})
export class GlobalMessagesSnackBarComponent {
  private _snackBar = inject(MatSnackBar)
  private globalErrorStore = inject(GlobalMessageStore)

  constructor() {
    this.globalErrorStore.state$.pipe(
      filter(({ errors }) => errors.length > 0),
      takeUntilDestroyed(),
    ).subscribe(({ errors }) => {
      errors.forEach(error => {
        this._snackBar.openFromComponent(SnackBarMessageComponent, {
          duration: 2500,
          data: error,
        }).afterDismissed().subscribe(() => this.globalErrorStore.removeError(error))
      })
    })
  }
}


