import { expect, Page } from '@playwright/test'
import { expectGlobalMessage } from './utils'

export const selectFormField = async (page: Page, label: string) => {
  await page.locator('div').filter({ hasText: new RegExp(`^${label}$`) }).nth(1).click()
  await expect(page.getByText('Update field')).toBeVisible()
}

export const addNewFormField = async (page: Page, name: string, label: string) => {
  await page.getByRole('button', { name: 'Add field' }).click()
  await expect(page.getByText('Add new field')).toBeVisible()

  await page.getByRole('textbox', { name: 'Field name' }).fill(name)
  await page.getByRole('textbox', { name: 'Label' }).fill(label)
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByText('Add new field')).not.toBeVisible()
  await expectGlobalMessage(page, 'The form field was saved successfully.')
}
