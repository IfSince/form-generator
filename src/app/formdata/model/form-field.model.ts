import { FieldSelectOption } from './form-field-select-option.model'

export enum FieldType {
  INTERFACE = 'INTERFACE',
  CLASS = 'CLASS',
  OBJECT = 'OBJECT',
  ENUM = 'ENUM',
  ARRAY = 'ARRAY',
  TUPLE = 'TUPLE',

  UNION = 'UNION',
  INTERSECTION = 'INTERSECTION',
  TYPE_PARAMETER = 'TYPE_PARAMETER',

  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  UNKNOWN = 'UNKNOWN', // Defaults to Input type string being generated
  ANY = 'ANY',

  CYCLIC_REFERENCE = 'CYCLIC_REFERENCE',
  NOT_RENDERED = 'NOT_RENDERED', // Types like never, void, null
  NOT_SUPPORTED = 'NOT_SUPPORTED'
}

export interface FormField {
  name: string,
  fieldType: FieldType,
  fields: FormField[],
  isRequired: boolean,
  isOptional: boolean,
  isReadonly: boolean,
  defaultValue?: unknown,
  options?: FieldSelectOption[],
  originalType?: string,
  placeholder?: string,
}
