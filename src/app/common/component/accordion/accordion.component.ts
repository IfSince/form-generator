import { Component, Input } from '@angular/core'
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { MatRipple } from '@angular/material/core'

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [
    CdkAccordion,
    CdkAccordionItem,
    FormsModule,
    MatIcon,
    MatRipple,
    ReactiveFormsModule,
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {
  @Input() title: string
}
