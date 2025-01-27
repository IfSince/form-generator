import { FieldType, FormField, MaterialComponentType } from '../../src/app/formdata/model/form-field.model'

export const testFormField = (
  name: string = 'testField',
  label: string = 'Test Field',
  fieldType: FieldType = FieldType.STRING,
  componentType: MaterialComponentType = MaterialComponentType.TEXT,
): FormField => ({
  name,
  label,
  fieldType,
  componentType,
  fields: null,
  defaultValue: null,
  fieldSelectOptions: null,
  readonly: false,
  required: true,
  multiple: false,
})
