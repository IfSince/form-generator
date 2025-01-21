import { FormField } from './form-field.model'

export enum InputType {
  TYPESCRIPT = 'TYPESCRIPT',
}

export interface CustomFormData {
  name: string
  originalText: string
  inputType: InputType
  fields: FormField[]
}
