import { Component, EventEmitter, Output } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({ template: '' })
export abstract class AbstractSubmitComponent<T> {
  abstract formGroup: AbstractControl

  @Output() submitForm = new EventEmitter<T>()

  onSubmit(shouldValidate = true): void {
    if (!shouldValidate) {
      this.submitForm.emit(this.formGroup.getRawValue())
      return
    }

    this.formGroup?.markAllAsTouched()
    this.formGroup?.updateValueAndValidity()
    if (this.formGroup?.valid) {
      this.submitForm.emit(this.formGroup.getRawValue())
    }
  }
}
