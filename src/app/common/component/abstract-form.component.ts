import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'
import { AbstractControl, FormGroup } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'
import { GlobalMessageStore } from '../service/global-message.store'

export type MessageMode = 'all' | 'submit' | 'error' | 'none'

@Component({template: ''})
export abstract class AbstractFormComponent<T> implements OnDestroy {
  protected globalMessageStore = inject(GlobalMessageStore)

  protected successMessage = 'The data was saved successfully.'
  protected errorMessage = 'The form contains errors and was not saved. See individual fields for more infos.'
  protected destroy$ = new Subject<void>()
  protected _valueChangesSubscription: Subscription
  abstract _formGroup: AbstractControl

  @Input() set formGroup(formGroup: FormGroup<ReactiveForm<T>>) {
    this._valueChangesSubscription?.unsubscribe()
    this._formGroup = formGroup

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

  onSubmit(shouldValidate = true, messageMode: MessageMode = 'all'): void {
    if (!shouldValidate) {
      this.submit(messageMode)
      return
    }

    this._formGroup?.markAllAsTouched()
    this._formGroup?.updateValueAndValidity()
    if (this._formGroup?.valid) {
      this.submit(messageMode)
    } else {
      this.showErrorMessage(messageMode)
    }
  }

  submit(messageMode: MessageMode) {
    this.submitForm.emit(this._formGroup.getRawValue())
    this.showSubmitMessage(messageMode)
  }

  private showSubmitMessage(messageMode: MessageMode): void {
    (messageMode == 'all' || messageMode == 'submit') && this.globalMessageStore.addSuccess(this.successMessage)
  }

  private showErrorMessage(messageMode: MessageMode): void {
    (messageMode == 'all' || messageMode == 'error') && this.globalMessageStore.addError(this.errorMessage)
  }
}
