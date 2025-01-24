import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgClass } from '@angular/common'
import { MatRipple } from '@angular/material/core'

@Component({
  selector: 'app-selectable-form-field',
  standalone: true,
  imports: [
    NgClass,
    MatRipple,
  ],
  templateUrl: './selectable-form-field.component.html',
  styleUrl: './selectable-form-field.component.css'
})
export class SelectableFormFieldComponent {
  @Input() selected = false
  @Output() select = new EventEmitter<void>();
}
