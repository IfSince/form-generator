import { Component, Input } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ReactiveForm } from '../../../../formdata/model/reactive-form-control.model'
import { FormField, MaterialComponentType } from '../../../../formdata/model/form-field.model'
import { GetComponentToRenderPipe, RenderableMatComponent } from '../../form-fields/material-field/get-component-to-render'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker'
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio'
import { NgTemplateOutlet } from '@angular/common'
import { AccordionComponent } from '../../../../common/component/accordion/accordion.component'

@Component({
  selector: 'app-edit-form-config-tab',
  standalone: true,
  imports: [
    FormsModule,
    GetComponentToRenderPipe,
    MatCheckbox,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatRadioButton,
    MatRadioGroup,
    MatSuffix,
    ReactiveFormsModule,
    NgTemplateOutlet,
    AccordionComponent,
  ],
  templateUrl: './edit-form-config-tab.component.html',
  styleUrl: './edit-form-config-tab.component.css'
})
export class EditFormConfigTabComponent {
  @Input() form: FormGroup<ReactiveForm<FormField>>

  protected readonly RenderableMatComponent = RenderableMatComponent
  protected readonly MaterialComponentType = MaterialComponentType
}
