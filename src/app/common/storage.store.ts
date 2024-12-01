import { Store } from './store'
import { inject, Injectable } from '@angular/core'
import { StorageService } from './storage/storage.service'
import { map, skip } from 'rxjs/operators'
import { distinctUntilChanged } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

export interface StorableState<T> {
  data: T | null
}

@Injectable({
  providedIn: 'root',
})
export abstract class StorageStore<T extends StorableState<T['data']>> extends Store<StorableState<T['data']>> {
  private readonly storageService = inject(StorageService)
  private readonly storageKey: string

  protected constructor(initialState: T, storageKey: string) {
    super(initialState)
    this.storageKey = storageKey

    this.init()

    this.state$.pipe(
      skip(1), // otherwise this would always get called once with the initialState because of the "super(initialState)" above and clear data in storage
      map(state => state.data),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(formData => {
      formData !== null
        ? this.storageService.setItem<T['data']>(this.storageKey, formData)
        : this.storageService.removeItem(this.storageKey)
    })
  }

  init() {
    const data = this.storageService.getItem<T['data']>(this.storageKey)
    if (data !== null) {
      this.updateState({ data })
    }
  }
}
