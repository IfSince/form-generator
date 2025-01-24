import { Component, EventEmitter, inject, Output } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { GlobalMessageStore } from '../service/global-message.store'

export type SubmitMessageMode = 'all' | 'submit' | 'error' | 'none'

@Component({ template: '' })
export abstract class AbstractSubmitComponent<T> {
  protected successMessage = 'The data was saved successfully.'
  protected errorMessage = 'The form contains errors and was not saved. See individual fields for more infos.'
  protected globalMessageStore = inject(GlobalMessageStore)

  abstract _formGroup: AbstractControl
  protected originalValue: T

  @Output() submitForm = new EventEmitter<T>()

  onSubmit(shouldValidate = true, messageMode: SubmitMessageMode = 'all'): void {
    if (!shouldValidate) {
      this.submit(messageMode)
      return
    }

    this._formGroup?.markAllAsTouched()
    this._formGroup?.updateValueAndValidity()
    if (this._formGroup?.valid) {
      this.submit(messageMode)
    } else {
      this.showErrorMessage(messageMode) && this.globalMessageStore.addError(this.errorMessage)
    }
  }

  submit(messageMode: SubmitMessageMode) {
    this.originalValue = this._formGroup.getRawValue()
    this.submitForm.emit(this._formGroup.getRawValue())
    this.showSubmitMessage(messageMode) && this.globalMessageStore.addSuccess(this.successMessage)
  }

  private showSubmitMessage(messageMode: SubmitMessageMode): boolean {
    return messageMode == 'all' || messageMode == 'submit'
  }

  private showErrorMessage(messageMode: SubmitMessageMode): boolean {
    return messageMode == 'all' || messageMode == 'error'
  }
}
