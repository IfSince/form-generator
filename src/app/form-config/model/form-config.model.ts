export interface FormConfig {
  test: string

  // Form Field Defaults
  formFieldAppearanceDefault?: 'fill' | 'outline' // appearance of mat-form-field (input, textarea, select, date)
  hideRequiredMarkerDefault?: boolean // hide asteriks at form field when required
  floatLabelDefault?: 'always' | 'auto' // whether label of mat-form-field floats per default
}
