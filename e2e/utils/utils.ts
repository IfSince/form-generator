import { expect, Page } from '@playwright/test'
import { CustomFormData } from '../../src/app/formdata/model/custom-form-data.model'
import { testFormData } from '../testdata/form-data.testdata'
import { FormConfig } from '../../src/app/form-config/model/form-config.model'
import { testFormConfig } from '../testdata/form-config.testdata'

export const routeAndValidateTitle = async (page: Page, target: string, title: string) => {
  await page.goto(target)
  await expect(page).toHaveTitle(title)
}

export const expectGlobalMessage = async (page: Page, message: string) => {
  await expect(page.locator('app-snack-bar-message-component')).toContainText(message)
}

/* Form Data */
export const getFormDataFromLocalStorage = async (page: Page) => {
  const formDataAsString = await page.evaluate(() => window.localStorage.getItem('formData'))
  const formData: CustomFormData = JSON.parse(formDataAsString)

  return formData
}

export const setFormDataInLocalStorage = async (page: Page, formData: CustomFormData = testFormData()) => {
  await page.addInitScript((data) => {
    window.localStorage.setItem('formData', JSON.stringify(data));
  }, formData);
}

/* Form Config */
export const getFormConfigInLocalStorage = async (page: Page) => {
  const formConfigAsString = await page.evaluate(() => window.localStorage.getItem('formConfig'))
  const formConfig: FormConfig = JSON.parse(formConfigAsString)

  return formConfig
}

export const setFormConfigInLocalStorage = async (page: Page, formConfig: FormConfig = testFormConfig()) => {
  await page.addInitScript((data) => {
    window.localStorage.setItem('formConfig', JSON.stringify(data));
  }, formConfig);
}
