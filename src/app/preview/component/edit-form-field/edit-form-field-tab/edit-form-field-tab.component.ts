import { Component, Input } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ReactiveForm } from '../../../../formdata/model/reactive-form-control.model'
import { FormField, MATERIAL_COMPONENT_OPT_GROUPS, MATERIAL_INPUT_COMPONENT_TYPES, MaterialComponentType } from '../../../../formdata/model/form-field.model'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDivider } from '@angular/material/divider'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatOptgroup, MatOption } from '@angular/material/core'
import { MatSelect } from '@angular/material/select'
import { AccordionComponent } from '../../../../common/component/accordion/accordion.component'

@Component({
  selector: 'app-edit-form-field-tab',
  standalone: true,
  imports: [
    FormsModule,
    MatCheckbox,
    MatDivider,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOptgroup,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    AccordionComponent,
  ],
  templateUrl: './edit-form-field-tab.component.html',
  styleUrl: './edit-form-field-tab.component.css'
})
export class EditFormFieldTabComponent {
  @Input() form: FormGroup<ReactiveForm<FormField>>

  DEFAULT_EXPANDED_FIELD_OPTION_COMPONENT_TYPES = [
    ...MATERIAL_INPUT_COMPONENT_TYPES,
    MaterialComponentType.TEXTAREA,
    MaterialComponentType.DATE,
    MaterialComponentType.SELECT,
  ]

  protected readonly MaterialComponentType = MaterialComponentType
  protected readonly MATERIAL_COMPONENT_OPT_GROUPS = MATERIAL_COMPONENT_OPT_GROUPS
}
