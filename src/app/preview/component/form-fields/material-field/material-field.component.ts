import { Component, Input } from '@angular/core'
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule } from '@angular/material/core'
import { FieldType, FormField } from '../../../../formdata/model/form-field.model'
import { ReactiveForm } from '../../../../formdata/model/reactive-form-control.model'
import { FormatLabelPipe } from '../../../../common/utils'

@Component({
  selector: 'app-material-field',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    FormatLabelPipe,
  ],
  templateUrl: './material-field.component.html',
  styleUrl: './material-field.component.css',
})
export class MaterialFieldComponent {
  protected readonly FieldType = FieldType

  @Input() field: FormGroup<ReactiveForm<FormField>>
}
