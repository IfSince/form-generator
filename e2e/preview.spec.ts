import { expect, test } from '@playwright/test'
import { expectGlobalMessage, getFormDataFromLocalStorage, routeAndValidateTitle, setFormDataInLocalStorage } from './utils/utils'
import { testFormData } from './testdata/form-data.testdata'
import { testFormField } from './testdata/form-field.testdata'
import { addNewFormField, selectFormField } from './utils/preview.util'

test.describe('Preview Page', () => {
  const testField = testFormField('testField', 'Test Field')
  const testData = testFormData([testField])

  test('shows empty placeholder if no data is set in localStorage', async ({ page }) => {
    await routeAndValidateTitle(page, '/preview', 'Preview')

    await expect(page.getByTestId('preview-placeholder'))
      .toContainText('No fields provided in the form data. Add a field to preview and edit the form, or upload a typescript type definition.')
  })

  test.describe('with formData in localStorage', () => {
    test.beforeEach(async ({ page }) => {
      await setFormDataInLocalStorage(page, testData)
      await routeAndValidateTitle(page, '/preview', 'Preview')
    })

    test('opens editing pane and saves changes to form data when selecting and updating form field', async ({ page }) => {
      const updatedFieldName = 'updatedFieldName'
      const updatedLabel = 'Updated Label'

      await selectFormField(page, testField.label)

      // update field
      await page.getByRole('textbox', { name: 'Field name', exact: true }).fill(updatedFieldName)
      await page.getByRole('textbox', { name: 'Label', exact: true }).fill(updatedLabel)
      await page.getByRole('button', { name: 'Save' }).click()

      // verify update
      await expect(page.getByText('Update field')).not.toBeVisible()
      await expectGlobalMessage(page, 'The form field was saved successfully.')
      const formData = await getFormDataFromLocalStorage(page)
      expect(formData.fields[0].name).toEqual(updatedFieldName)
      expect(formData.fields[0].label).toEqual(updatedLabel)
    })

    test('shows error and does not submit if edited data is invalid', async ({ page }) => {
      await selectFormField(page, testField.label)

      // update field
      await page.getByRole('textbox', { name: 'Field name', exact: true }).clear()
      await page.getByRole('button', { name: 'Save' }).click()

      // verify update
      await expect(page.getByText('Update field')).toBeVisible()
      await expectGlobalMessage(page, 'The form contains errors and was not saved. See individual fields for more infos.')

      const formData = await getFormDataFromLocalStorage(page)
      expect(formData.fields[0].name).toEqual(testField.name)
      expect(formData.fields[0].label).toEqual(testField.label)
    })

    test('canceling edit resets form field and does not update form data', async ({ page }) => {
      const updatedFieldName = 'updatedFieldName'
      const updatedLabel = 'Updated Label'

      await page.locator('div').filter({ hasText: new RegExp(`^${testField.label}$`) }).nth(1).click()

      await page.getByRole('textbox', { name: 'Field name', exact: true }).fill(updatedFieldName)
      await page.getByRole('textbox', { name: 'Label', exact: true }).fill(updatedLabel)
      await page.getByRole('button', { name: 'Cancel' }).click()

      const formData = await getFormDataFromLocalStorage(page)
      expect(formData.fields[0].name).toEqual(testField.name)
      expect(formData.fields[0].label).toEqual(testField.label)
    })

    test('add new field updates form data', async ({ page }) => {
      const newFieldName = 'newField'
      const newFieldLabel = 'New Label'

      await addNewFormField(page, newFieldName, newFieldLabel)

      const formData = await getFormDataFromLocalStorage(page)
      expect(formData.fields[1]).toBeDefined()
      expect(formData.fields[1].name).toEqual(newFieldName)
      expect(formData.fields[1].label).toEqual(newFieldLabel)
    })

    test('selecting a different field while editing resets changes', async ({ page }) => {
      const newFieldName = 'newField'
      const newFieldLabel = 'New Label'
      await addNewFormField(page, newFieldName, newFieldLabel)

      // await page.locator('div').filter({ hasText: new RegExp(`^${testField.label}$`) }).nth(1).click()
      await page.locator('div').filter({ hasText: /^Test Field$/ }).first().click()

      await page.getByRole('textbox', { name: 'Field name', exact: true }).fill('updatedField')
      await page.getByRole('textbox', { name: 'Label', exact: true }).fill('Updated Label')

      await page.locator('div').filter({ hasText: /^New Label$/ }).first().click()

      const formData = await getFormDataFromLocalStorage(page)
      expect(formData.fields[0].name).toEqual(testField.name)
      expect(formData.fields[0].label).toEqual(testField.label)
    })

    test('removing field updates form data', async ({ page }) => {
      await selectFormField(page, testField.label)

      await page.getByRole('button', { name: 'Remove' }).click()

      await expectGlobalMessage(page, 'The field was removed successfully.')
      const formData = await getFormDataFromLocalStorage(page)
      expect(formData.fields).toHaveLength(0)
    })

    test('deletes form data and clears form fields when discarding process', async ({ page }) => {
      await page.getByRole('button', { name: 'Discard process' }).click()
      await page.getByRole('button', { name: 'Yes' }).click()

      await expectGlobalMessage(page, 'The data was cleared successfully.')

      const formData = await getFormDataFromLocalStorage(page)
      expect(formData).toBeNull()
    })

    test('creates source code', async ({ page }) => {
      await page.getByRole('button', { name: 'Generate code' }).click();

      const sourceCode = await page.evaluate(() => navigator.clipboard.readText());
      expect(sourceCode).toBeDefined()
    })
  })
})
