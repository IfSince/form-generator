import { FormConfig } from '../../src/app/form-config/model/form-config.model'
import { MaterialComponentType } from '../../src/app/formdata/model/form-field.model'

export const testFormConfig = (): FormConfig => ({
  formFieldAppearance: 'fill',
  hideRequiredMarker: null,
  floatLabel: 'auto',
  subscriptSizing: null,
  disableRipple: null,
  disabledInteractive: null,
  labelPosition: null,
  hideSingleSelectionIndicator: null,
  panelClass: 'test',
  textareaAutosize: null,
  textareaMinRows: null,
  textareaMaxRows: null,
  sliderDiscrete: null,
  sliderShowTickMarks: null,
  slideToggleHideIcon: null,
  selectDisableOptionCentering: null,
  selectAddNullOption: null,
  datepickerRestoreFocus: null,
  datepickerTouchUi: null,
  buttonToggleHideMultiSelectionIndicator: null,
  buttonToggleAppearance: null,
  defaultComponents: {
    string: MaterialComponentType.TEXT,
    number: MaterialComponentType.NUMBER,
    boolean: MaterialComponentType.CHECKBOX,
    enum: MaterialComponentType.SELECT,
    date: MaterialComponentType.DATE,
    array: MaterialComponentType.BUTTON_TOGGLE,
    unsupported: MaterialComponentType.TEXT,
  }
})
