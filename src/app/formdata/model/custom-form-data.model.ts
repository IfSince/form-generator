import { FormField } from './form-field.model'

export enum InputType {
  TYPESCRIPT = 'TYPESCRIPT',
  MANUAL_INPUT = 'MANUAL_INPUT',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export interface CustomFormData {
  name: string
  inputType: InputType
  fields: FormField[]
}
