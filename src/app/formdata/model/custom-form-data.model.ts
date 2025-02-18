import { FormField } from './form-field.model'

export interface CustomFormData {
  selectedType: string
  typeDefinition: string
  fields: FormField[]
}
