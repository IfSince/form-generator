import { BehaviorSubject, Observable } from 'rxjs'

export abstract class Store<T> {
  state$: Observable<T>
  private _state$: BehaviorSubject<T>

  protected constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState)
    this.state$ = this._state$.asObservable()
  }

  get state(): T {
    return this._state$.getValue()
  }

  setState(state: T): void {
    this._state$.next(state)
  }

  updateState(state: Partial<T>): void {
    this.setState({ ...this.state, ...state })
  }
}
