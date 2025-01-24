import { Injectable } from '@angular/core'
import { Store } from './store'

export interface GlobalMessageState {
  errors: string[]
  success: string[]
}

@Injectable({
  providedIn: 'root',
})
export class GlobalMessageStore extends Store<GlobalMessageState> {
  static INITIAL_STATE: GlobalMessageState = {
    errors: [],
    success: [],
  }

  constructor() {
    super(GlobalMessageStore.INITIAL_STATE)
  }

  addError(message: string): void {
    this.updateState({ errors: [...this.state.errors, message] })
  }

  removeError(message: string): void {
    this.updateState(({ errors: this.state.errors.filter(error => error != message) }))
  }

  addSuccess(message: string): void {
    this.updateState({ success: [...this.state.success, message] })
  }

  removeSuccess(message: string): void {
    this.updateState(({ success: this.state.success.filter(success => success != message) }))
  }
}
