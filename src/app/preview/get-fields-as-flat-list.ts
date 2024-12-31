import { FormArray, FormGroup } from '@angular/forms'
import { ReactiveForm } from '../formdata/model/reactive-form-control.model'
import { FormField } from '../formdata/model/form-field.model'

export const getFieldsAsFlatList = (entries: FormArray): FormGroup<ReactiveForm<FormField>>[] =>
  entries.controls.reduce<FormGroup[]>((flatList, control) => {
    if (control instanceof FormGroup) {
      flatList.push(control)
      const fields = control.get('fields')
      if (fields instanceof FormArray) {
        flatList.push(...getFieldsAsFlatList(fields)) // Rekursive Verarbeitung
      }
    }
    return flatList
  }, [])
