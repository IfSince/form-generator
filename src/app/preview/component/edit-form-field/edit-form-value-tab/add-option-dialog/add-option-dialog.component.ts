import { Component, inject, Pipe, PipeTransform } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog'
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { ReactiveForm } from '../../../../../formdata/model/reactive-form-control.model'
import { FieldSelectOption } from '../../../../../formdata/model/form-field-select-option.model'
import { MatButton } from '@angular/material/button'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { GlobalMessageStore } from '../../../../../common/service/global-message.store'

export interface OptionDialogData {
  currentOptions: FieldSelectOption[]
}

@Pipe({
  name: 'mapToValues',
  standalone: true
})
export class MapFieldSelectOptionToValuePipe implements PipeTransform {
  transform(options: FieldSelectOption[]): string[] {
    return options.map(option => option.selectableValue)
  }
}

@Component({
  selector: 'app-add-option-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MapFieldSelectOptionToValuePipe,
  ],
  templateUrl: './add-option-dialog.component.html',
  styleUrl: './add-option-dialog.component.css'
})
export class AddOptionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddOptionDialogComponent>)
  private fb = inject(FormBuilder)
  private globalMessageStore = inject(GlobalMessageStore)
  data = inject<OptionDialogData>(MAT_DIALOG_DATA)

  optionFormGroup: FormGroup<ReactiveForm<FieldSelectOption>> = this.fb.group({
    displayName: this.fb.control(null, [Validators.required]),
    selectableValue: this.fb.control(null, [Validators.required, this.validateUniqueness()]),
  })

  onSubmit(): void {
    this.optionFormGroup?.markAllAsTouched()
    this.optionFormGroup?.updateValueAndValidity()

    if (this.optionFormGroup?.valid) {
      this.globalMessageStore.addSuccess('The option was added successfully.')
      this.dialogRef.close(this.optionFormGroup.getRawValue())
    }
  }

  validateUniqueness(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      const isDuplicate = this.data.currentOptions.some(option => option.selectableValue === value);

      return isDuplicate ? { uniqueSelectableValue: { value: value } } : null;
    };
  }
}
