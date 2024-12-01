export interface CustomFormData {
  name: string
  inputType: InputType
  fields: FormField[]
}

export enum InputType {
  TYPESCRIPT= 'TYPESCRIPT',
  MANUAL_INPUT = 'MANUAL_INPUT',
  FILE_UPLOAD = 'FILE_UPLOAD',
}

export interface FormField {
  name: string
  fieldType: FieldType
  originalTypeName: string
  options?: { value: unknown, displayName: string }[]
  nestedFields?: FormField[]
  inheritedFields?: FormField[]
  tupleFields?: FormField[]
}

export enum FieldType {
  STRING= 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
  TUPLE = 'TUPLE',
  ENUM = 'ENUM',
  CLASS = 'CLASS',
  INTERFACE = 'INTERFACE',

  UNION = 'UNION',
  INTERSECTION = 'INTERSECTION',
  UNKNOWN = 'UNKNOWN', // Defaults to Input type string being generated
}
