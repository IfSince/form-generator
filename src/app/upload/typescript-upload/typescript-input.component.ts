import { Component, EventEmitter, Output } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormField } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'
import { MatCardActions } from '@angular/material/card'
import { AbstractSubmitComponent } from '../../common/component/abstract-submit.component'

@Component({
  selector: 'app-typescript-input',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatCardActions,
  ],
  templateUrl: './typescript-input.component.html',
  styleUrl: './typescript-input.component.css'
})
export class TypescriptInputComponent extends AbstractSubmitComponent<string> {
  _control = new FormControl('')
}
