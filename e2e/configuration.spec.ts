import { expect, test } from '@playwright/test'
import { expectGlobalMessage, getFormConfigInLocalStorage, routeAndValidateTitle, setFormConfigInLocalStorage } from './utils/utils'
import { testFormConfig } from './testdata/form-config.testdata'

test.describe('Configuration Page', () => {
  test.describe('without formConfig in localStorage', () => {
    test.beforeEach(async ({ page }) => {
      await routeAndValidateTitle(page, '/configuration', 'Configuration')
    })

    test('importing formConfig.json file updates sets config in localStorage', async ({ page }) => {
      await page.locator('input[type="file"]').setInputFiles('e2e/testdata/files/formConfig.json')

      await expectGlobalMessage(page, 'The form data was imported successfully.')

      const formConfig = await getFormConfigInLocalStorage(page)
      expect(formConfig).toEqual(testFormConfig())
    })

    test('shows error and does not update/set config in localStorage if file is not if type application/json', async ({ page }) => {
      await page.locator('input[type="file"]').setInputFiles('e2e/testdata/files/invalidFileType.ts')

      await expectGlobalMessage(page, 'Only files of type json are allowed.')

      const formConfig = await getFormConfigInLocalStorage(page)
      expect(formConfig).toBeNull()
    })

    test('shows error if imported json data could not be converted to form data', async ({ page }) => {
      await page.locator('input[type="file"]').setInputFiles('e2e/testdata/files/invalidFormData.json')

      await expectGlobalMessage(page, 'The imported json data could not be converted to form data.')

      const formConfig = await getFormConfigInLocalStorage(page)
      expect(formConfig).toBeNull()
    })

    test('editing and saving form fields updates config in localStorage', async ({ page }) => {
      const testConfig = testFormConfig()

      await page.getByRole('radio', { name: 'Fill' }).click()
      await page.getByRole('radio', { name: 'Auto' }).click()
      await page.locator('input[formControlName="panelClass"]').fill(testConfig.panelClass)

      await page.getByRole('button', { name: 'Save' }).click()

      await expectGlobalMessage(page, 'The data was saved successfully.')

      const formConfig = await getFormConfigInLocalStorage(page)
      expect(formConfig).toEqual(testConfig)
    })
  })

  test.describe('with formConfig in localStorage', () => {
    const testConfig = testFormConfig()

    test.beforeEach(async ({ page }) => {
      await setFormConfigInLocalStorage(page, testConfig)
      await routeAndValidateTitle(page, '/configuration', 'Configuration')
    })

    test('resetting form clears form config in localStorage', async ({ page }) => {
      await page.getByRole('button', { name: 'Zurücksetzen' }).click()

      await expect(page.getByRole('heading', { name: 'Reset configurations' })).toBeVisible()
      await page.getByRole('button', { name: 'Yes' }).click()

      await expectGlobalMessage(page, 'The data was cleared successfully.')

      const formConfig = await getFormConfigInLocalStorage(page)
      expect(formConfig).toBeNull()
    })

    test('export downloads current form data as formConfig.json', async ({ page }) => {
      const downloadPromise = page.waitForEvent('download');

      await page.getByRole('link', { name: 'Export' }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBe('formConfig.json');
    })
  })
})
