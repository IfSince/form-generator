import { expect, test } from '@playwright/test'
import { expectGlobalMessage, getFormDataFromLocalStorage, routeAndValidateTitle, setFormDataInLocalStorage } from './utils/utils'
import { testFormData } from './testdata/form-data.testdata'

test.describe('Upload Page', () => {
  test('automatically selects type, creates form data and routes to preview if user input is valid', async ({ page }) => {
    const testData = testFormData()

    await routeAndValidateTitle(page, '/', 'Upload')

    await page.getByRole('textbox', { name: 'Type definition' }).fill(testData.originalText)

    await expect(page.getByRole('combobox', { name: 'Selected Type' })).toContainText(testData.name)

    await page.getByRole('button', { name: 'Create form data' }).click()

    await expectGlobalMessage(page, 'The form data was created successfully.')
    await expect(page).toHaveURL('/preview')

    const formData = await getFormDataFromLocalStorage(page)
    expect(formData).toEqual(testData)
  })

  test('shows error and does not create form data if user input is invalid', async ({ page }) => {
    await routeAndValidateTitle(page, '/', 'Upload')

    await page.getByRole('textbox', { name: 'Type definition' }).fill('Invalid user input')
    await page.getByRole('button', { name: 'Create form data' }).click()

    await expectGlobalMessage(page, 'The form contains errors and was not saved. See individual fields for more infos.')

    const localStorageData = await getFormDataFromLocalStorage(page)
    expect(localStorageData).toBeNull()
  })

  test('deletes form data and clears form fields when discarding process', async ({ page }) => {
    await setFormDataInLocalStorage(page)

    await routeAndValidateTitle(page, '/', 'Upload')

    await page.getByRole('button', { name: 'Discard process' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();

    await expectGlobalMessage(page, 'The data was cleared successfully.')

    await expect(page.getByRole('textbox', { name: 'Type definition' })).toBeEmpty();
    await expect(page.getByRole('combobox', { name: 'Selected Type' })).toBeEmpty();

    const formData = await getFormDataFromLocalStorage(page)
    expect(formData).toBeNull()
  })
})
