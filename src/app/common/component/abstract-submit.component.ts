import { Component, EventEmitter, inject, Output } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { GlobalMessageStore } from '../service/global-message.store'

@Component({ template: '' })
export abstract class AbstractSubmitComponent<T> {
  private globalErrorStore = inject(GlobalMessageStore)

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
    } else {
      this.globalErrorStore.addError('The form contains errors and was not saved. See individual fields for more infos.')
    }
  }
}
