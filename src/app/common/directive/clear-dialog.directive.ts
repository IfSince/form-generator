import { Directive, HostListener, inject, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from '../component/clear-dialog/dialog.component'

@Directive({
  selector: '[appClearDialog]',
  standalone: true,
})
export class ClearDialogDirective {
  @Input('appClearDialog') onClearCallback!: () => void
  @Input() appClearDialogTitle?: string = 'Discard process'
  @Input() appClearDialogText?: string = 'Do you really want to reset form data and discard the current process?'

  private dialog = inject(MatDialog)

  @HostListener('click')
  onClick(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: this.appClearDialogTitle,
        text: this.appClearDialogText,
        denyText: 'No',
        confirmText: 'Yes',
      },
    })
    dialogRef.afterClosed().subscribe(shouldClear => shouldClear && this.onClearCallback())
  }
}
