import { CustomFormData } from '../../src/app/formdata/model/custom-form-data.model'
import { FieldType, FormField, MaterialComponentType } from '../../src/app/formdata/model/form-field.model'
import { testFormField } from './form-field.testdata'

export const testFormData = (
  fields: FormField[] = [testFormField('testField', 'Test Field', FieldType.STRING, MaterialComponentType.TEXT)],
  name: string = 'TestClass',
  originalText: string = 'export class TestClass { testField: string }',
): CustomFormData => ({
  selectedType: name,
  typeDefinition: originalText,
  fields,
})
