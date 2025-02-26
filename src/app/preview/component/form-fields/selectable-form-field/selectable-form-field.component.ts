import { Component, EventEmitter, Input, Output } from '@angular/core'
import { NgClass } from '@angular/common'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'app-selectable-form-field',
  standalone: true,
  imports: [
    NgClass,
    MatTooltip,
  ],
  templateUrl: './selectable-form-field.component.html',
  styleUrl: './selectable-form-field.component.css'
})
export class SelectableFormFieldComponent {
  @Input() selected = false
  @Input() unsupported = false
  @Output() select = new EventEmitter<void>();
}
