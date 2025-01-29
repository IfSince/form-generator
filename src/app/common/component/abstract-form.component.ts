import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'
import { AbstractControl, FormGroup } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'
import { GlobalMessageStore } from '../service/global-message.store'

export type SubmitMessageMode = 'all' | 'submit' | 'error' | 'none'

@Component({template: ''})
export abstract class AbstractFormComponent<T> implements OnDestroy {
  protected globalMessageStore = inject(GlobalMessageStore)

  protected successMessage = 'The data was saved successfully.'
  protected errorMessage = 'The form contains errors and was not saved. See individual fields for more infos.'
  protected destroy$ = new Subject<void>()
  protected _valueChangesSubscription: Subscription
  abstract _formGroup: AbstractControl
  protected originalValue: T

  @Input() set formGroup(formGroup: FormGroup<ReactiveForm<T>>) {
    this._valueChangesSubscription?.unsubscribe()
    this._formGroup = formGroup
    this.originalValue = formGroup.getRawValue() as T // remember original value to be able to reset

    this.valueChangesSubscription()
  }

  @Output() submitForm = new EventEmitter<T>()

  ngOnDestroy(): void {
    this._valueChangesSubscription?.unsubscribe()

    this.destroy$.next()
    this.destroy$.complete()
  }

  // override this to add custom value change subscriptions in implementations of abstract form component
  protected valueChangesSubscription(): void {
    this._valueChangesSubscription = null
  }

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
