import { Component, EventEmitter, Output } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({ template: '' })
export abstract class AbstractSubmitComponent<T> {
  abstract _control: AbstractControl

  @Output() submit = new EventEmitter<T>()

  onSubmit(): void {
    this._control?.markAllAsTouched()
    this._control?.updateValueAndValidity()

    if (this._control?.valid) {
      this.submit.emit(this._control.getRawValue())
    }
  }
}
