import { Component, Input } from '@angular/core'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'
import { MatListItem, MatListItemLine, MatListItemMeta, MatListItemTitle } from '@angular/material/list'
import { FormControl, FormControlOptions, ReactiveFormsModule } from '@angular/forms'
import { FieldSelectOption } from '../../../../formdata/model/form-field-select-option.model'

@Component({
  selector: 'app-list-item-toggle',
  standalone: true,
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    MatListItem,
    MatListItemLine,
    MatListItemMeta,
    MatListItemTitle,
    ReactiveFormsModule,
  ],
  templateUrl: './list-item-button-toggle.component.html',
  styleUrl: './list-item-button-toggle.component.css'
})
export class ListItemButtonToggleComponent {
  @Input() field: any
  @Input() formControlName: string
  @Input() label: string
  @Input() description?: string = null
  @Input() options: FieldSelectOption[]
}
