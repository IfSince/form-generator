import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormConfig } from '../model/form-config.model'
import { ReactiveForm } from '../../formdata/model/reactive-form-control.model'

@Injectable({
  providedIn: 'root',
})
export class FormConfigFormBuilderService {

  constructor(private fb: FormBuilder) {
  }

  buildFormConfig(config: FormConfig): FormGroup<ReactiveForm<FormConfig>> {
    return this.fb.group({
      test: [config?.test],

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
    }) as FormGroup<ReactiveForm<FormConfig>>
  }
}
