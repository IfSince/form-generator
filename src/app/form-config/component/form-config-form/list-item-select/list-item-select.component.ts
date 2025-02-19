import { Component, Input } from '@angular/core'
import { MatListItem, MatListItemLine, MatListItemMeta, MatListItemTitle } from '@angular/material/list'
import { MatFormField, MatOptgroup, MatOption, MatSelect } from '@angular/material/select'
import { ReactiveFormsModule } from '@angular/forms'
import { MATERIAL_COMPONENT_OPT_GROUPS } from '../../../../formdata/model/form-field.model'

@Component({
  selector: 'app-list-item-select',
  standalone: true,
  imports: [
    MatListItem,
    MatListItemTitle,
    MatListItemMeta,
    MatSelect,
    MatOption,
    MatOptgroup,
    ReactiveFormsModule,
    MatFormField,
    MatListItemLine,
  ],
  templateUrl: './list-item-select.component.html',
  styleUrl: './list-item-select.component.css',
})
export class ListItemSelectComponent {
  protected readonly MATERIAL_COMPONENT_OPT_GROUPS = MATERIAL_COMPONENT_OPT_GROUPS

  @Input() fieldControl: any
  @Input() label: string
  @Input() description: string
}
