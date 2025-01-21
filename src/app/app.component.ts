import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { LayoutComponent } from './common/component/layout/layout.component'
import { GlobalMessagesSnackBarComponent } from './common/component/error-handling/global-message-snack-bar/global-messages-snack-bar.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, GlobalMessagesSnackBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
