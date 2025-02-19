import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop'
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { FormField } from '../../../formdata/model/form-field.model'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { MaterialFieldComponent } from '../form-fields/material-field/material-field.component'

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    ReactiveFormsModule,
    MaterialFieldComponent,

  ],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.css',
})
export class DragDropComponent {
  @Input() fieldFormGroups: FormArray<FormGroup<ReactiveForm<FormField>>>
  @Output() onDrop: EventEmitter<void> = new EventEmitter()

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldFormGroups.controls, event.previousIndex, event.currentIndex)
    this.onDrop.emit()
  }
}
