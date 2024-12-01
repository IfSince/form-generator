import { EnvironmentProviders, inject, Injectable, InjectionToken, makeEnvironmentProviders } from '@angular/core'

export const STORAGE = new InjectionToken<Storage>('WEB_STORAGE')

export const provideStorage = (storage: Storage): EnvironmentProviders => makeEnvironmentProviders([
  { provide: STORAGE, useValue: storage },
]);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage = inject(STORAGE)

  getItem<T>(key: string): T | null {
    const raw = this.storage.getItem(key)

    return raw && JSON.parse(raw)
  }

  setItem<T>(key: string, value: T | null): void {
    this.storage.setItem(key, JSON.stringify(value))
  }

  removeItem(key: string): void {
    this.storage.removeItem(key)
  }
}
