import { Component, Input, OnInit } from '@angular/core'
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop'
import { ReactiveFormsModule } from '@angular/forms'
import { FormField } from '../../../formdata/model/form-field.model'

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    ReactiveFormsModule,

  ],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.css',
})
export class DragDropComponent implements OnInit {
  @Input() fields: FormField[]

  fieldsTest: FormField[] = []

  ngOnInit() {
    this.fieldsTest = this.fields
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldsTest, event.previousIndex, event.currentIndex)
  }

}
