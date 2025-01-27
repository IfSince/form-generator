export interface FormConfig {
  // Form Field Defaults
  formFieldAppearance?: 'fill' | 'outline'
  hideRequiredMarker?: boolean
  floatLabel?: 'always' | 'auto'
  subscriptSizing?: 'fixed' | 'dynamic'

  // Checkbox, SlideToggle, RadioButton, Select
  disableRipple?: boolean

  // Checkbox, SlideToggle, RadioButton
  disabledInteractive?: boolean
  labelPosition?: 'before' | 'after'

  // Select, Button Toggle
  hideSingleSelectionIndicator?: boolean

  // Select, Datepicker
  panelClass?: string

  // Textarea
  textareaAutosize?: boolean
  textareaMinRows?: number
  textareaMaxRows?: number

  // Slider
  sliderDiscrete?: boolean
  sliderShowTickMarks?: boolean

  // SlideToggle
  slideToggleHideIcon?: boolean

  // Select
  selectDisableOptionCentering?: boolean
  selectAddNullOption?: boolean

  // Datepicker
  datepickerRestoreFocus?: boolean
  datepickerTouchUi?: boolean

  // ButtonToggle
  buttonToggleHideMultiSelectionIndicator?: boolean
  buttonToggleAppearance?: 'legacy' | 'standard'
}
