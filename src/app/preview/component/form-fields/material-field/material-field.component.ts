import { Component, Input } from '@angular/core'
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core'
import { FormField } from '../../../../formdata/model/form-field.model'
import { ReactiveForm } from '../../../../formdata/model/reactive-form-control.model'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { GetComponentToRenderPipe, RenderableMatComponent } from './get-component-to-render'
import { GetInputTypePipe } from './get-input-type.pipe'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { MatSlider, MatSliderThumb } from '@angular/material/slider'
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio'
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle'

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
    MatDatepickerModule,
    GetComponentToRenderPipe,
    GetInputTypePipe,
    MatSlideToggle,
    MatSlider,
    MatSliderThumb,
    MatRadioGroup,
    MatRadioButton,
    MatButtonToggle,
    MatButtonToggleGroup,

  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './material-field.component.html',
  styleUrl: './material-field.component.css',
})
export class MaterialFieldComponent {
  protected readonly RenderableMatComponent = RenderableMatComponent

  @Input() matField: FormField
}
