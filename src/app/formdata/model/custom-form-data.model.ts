import { FormField } from './form-field.model'

export interface CustomFormData {
  name: string
  originalText: string
  fields: FormField[]
}
