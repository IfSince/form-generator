import { Directive, HostListener, inject, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ClearDialogComponent } from '../component/clear-dialog/clear-dialog.component'

@Directive({
  selector: '[appClearDialog]',
  standalone: true,
})
export class ClearDialogDirective {
  @Input('appClearDialog') onClearCallback!: () => void
  @Input() appClearDialogTitle?: string = 'Zurücksetzen'
  @Input() appClearDialogText?: string = 'Willst du die Daten wirklich zurücksetzen?'

  private dialog = inject(MatDialog)

  @HostListener('click')
  onClick(): void {
    const dialogRef = this.dialog.open(ClearDialogComponent, {
      width: '350px',
      data: { title: this.appClearDialogTitle, text: this.appClearDialogText },
    })
    dialogRef.afterClosed().subscribe(shouldClear => shouldClear && this.onClearCallback())
  }
}
