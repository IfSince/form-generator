import { Injectable } from '@angular/core'
import { StorableState, StorageStore } from '../../common/service/storage/storage.store'
import { FormConfig } from '../model/form-config.model'

@Injectable({
  providedIn: 'root',
})
export class FormConfigStore extends StorageStore<StorableState<FormConfig>> {
  static INITIAL_STATE: StorableState<FormConfig> = { data: null }

  constructor() {
    super(FormConfigStore.INITIAL_STATE, 'formConfig')
  }
}
