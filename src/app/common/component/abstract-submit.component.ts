import { Component, EventEmitter, Output } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({ template: '' })
export abstract class AbstractSubmitComponent<T> {
  abstract _formGroup: AbstractControl

  @Output() submitForm = new EventEmitter<T>()

  onSubmit(shouldValidate = true): void {
    if (!shouldValidate) {
      this.submitForm.emit(this._formGroup.getRawValue())
      return
    }

    this._formGroup?.markAllAsTouched()
    this._formGroup?.updateValueAndValidity()
    if (this._formGroup?.valid) {
      this.submitForm.emit(this._formGroup.getRawValue())
    }
  }
}
