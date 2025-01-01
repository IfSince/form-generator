import { Component, Input, OnDestroy } from '@angular/core'
import { AbstractSubmitComponent } from './abstract-submit.component'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'
import { FormGroup } from '@angular/forms'
import { Subject, Subscription } from 'rxjs'

@Component({template: ''})
export abstract class AbstractFormComponent<T> extends AbstractSubmitComponent<T> implements OnDestroy {
  @Input() set formGroup(formGroup: FormGroup<ReactiveForm<T>>) {
    this.valueChangesSubscription?.unsubscribe()
    this._formGroup = formGroup

    this.setValueChangesSubscription()
  }

  protected destroy$ = new Subject<void>()
  protected valueChangesSubscription: Subscription

  protected setValueChangesSubscription(): void {
    this.valueChangesSubscription = null
  }

  ngOnDestroy(): void {
    this.valueChangesSubscription?.unsubscribe()

    this.destroy$.next()
    this.destroy$.complete()
  }
}
