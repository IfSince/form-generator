import { Component, Input, OnDestroy } from '@angular/core'
import { AbstractSubmitComponent } from './abstract-submit.component'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'
import { FormGroup } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'

@Component({template: ''})
export abstract class AbstractFormComponent<T> extends AbstractSubmitComponent<T> implements OnDestroy {
  @Input() set formGroup(formGroup: FormGroup<ReactiveForm<T>>) {
    this._valueChangesSubscription?.unsubscribe()
    this._formGroup = formGroup
    this.originalValue = formGroup.getRawValue() as T // remember original value to be able to reset

    this.valueChangesSubscription()
  }

  protected destroy$ = new Subject<void>()
  protected _valueChangesSubscription: Subscription

  ngOnDestroy(): void {
    this._valueChangesSubscription?.unsubscribe()

    this.destroy$.next()
    this.destroy$.complete()
  }

  // override this to add custom value change subscriptions in implementations of abstract form component
  protected valueChangesSubscription(): void {
    this._valueChangesSubscription = null
  }
}
