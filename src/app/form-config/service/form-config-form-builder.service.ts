import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormConfig } from '../model/form-config.model'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'
import { MaterialComponentType } from '../../formdata/model/form-field.model'

@Injectable({
  providedIn: 'root',
})
export class FormConfigFormBuilderService {

  constructor(private fb: FormBuilder) {
  }

  buildFormConfig(config: FormConfig): FormGroup<ReactiveForm<FormConfig>> {
    return this.fb.group({
      formFieldAppearance: [config?.formFieldAppearance],
      hideRequiredMarker: [config?.hideRequiredMarker],
      floatLabel: [config?.floatLabel],
      subscriptSizing: [config?.subscriptSizing],
      disableRipple: [config?.disableRipple],
      disabledInteractive: [config?.disabledInteractive],
      labelPosition: [config?.labelPosition],
      hideSingleSelectionIndicator: [config?.hideSingleSelectionIndicator],
      panelClass: [config?.panelClass],
      textareaAutosize: [config?.textareaAutosize],
      textareaMinRows: [config?.textareaMinRows],
      textareaMaxRows: [config?.textareaMaxRows],
      sliderDiscrete: [config?.sliderDiscrete],
      sliderShowTickMarks: [config?.sliderShowTickMarks],
      slideToggleHideIcon: [config?.slideToggleHideIcon],
      selectDisableOptionCentering: [config?.selectDisableOptionCentering],
      selectAddNullOption: [config?.selectAddNullOption],
      datepickerRestoreFocus: [config?.datepickerRestoreFocus],
      datepickerTouchUi: [config?.datepickerTouchUi],
      buttonToggleHideMultiSelectionIndicator: [config?.buttonToggleHideMultiSelectionIndicator],
      buttonToggleAppearance: [config?.buttonToggleAppearance],

      defaultComponents: this.fb.group({
        string: [config?.defaultComponents?.string ?? MaterialComponentType.TEXT],
        number: [config?.defaultComponents?.number ?? MaterialComponentType.NUMBER],
        boolean: [config?.defaultComponents?.boolean ?? MaterialComponentType.CHECKBOX],
        enum: [config?.defaultComponents?.enum ?? MaterialComponentType.SELECT],
        date: [config?.defaultComponents?.date ?? MaterialComponentType.DATE],
        array: [config?.defaultComponents?.array ?? MaterialComponentType.BUTTON_TOGGLE],
        unsupported: [config?.defaultComponents?.unsupported ?? MaterialComponentType.TEXT],
      }),
    }) as FormGroup<ReactiveForm<FormConfig>>
  }
}
