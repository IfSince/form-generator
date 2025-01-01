import { Injectable } from '@angular/core'
import { StorableState, StorageStore } from '../../common/service/storage/storage.store'
import { CustomFormData } from '../model/custom-form-data.model'

@Injectable({
  providedIn: 'root',
})
export class FormDataStore extends StorageStore<StorableState<CustomFormData>> {
  static INITIAL_STATE: StorableState<CustomFormData> = { data: null }

  constructor() {
    super(FormDataStore.INITIAL_STATE, 'formData')
  }
}
