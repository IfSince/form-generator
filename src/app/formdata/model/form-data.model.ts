export interface CustomFormData {
  name: string
  inputType: InputType
  fields: FormField[]
}

export enum InputType {
  TYPESCRIPT = 'TYPESCRIPT',
  MANUAL_INPUT = 'MANUAL_INPUT',
  FILE_UPLOAD = 'FILE_UPLOAD',
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
  originalType: string,
}

export enum AngularMaterialComponent {
  SELECT = 'SELECT',
}

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

export type FieldSelectOption = { displayName: string, value: string | number }
