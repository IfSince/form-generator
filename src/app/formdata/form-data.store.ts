import { Injectable } from '@angular/core'
import { CustomFormData } from './model/form-data.model'
import { StorableState, StorageStore } from '../common/storage.store'

export interface FormDataState extends StorableState<CustomFormData> {
}

@Injectable({
  providedIn: 'root',
})
export class FormDataStore extends StorageStore<FormDataState> {
  static INITIAL_STATE: FormDataState = {
    data: null,
  }

  constructor() {
    super(FormDataStore.INITIAL_STATE, 'formData')
  }
}
