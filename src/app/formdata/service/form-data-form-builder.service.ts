import { Injectable } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormField, MaterialComponentType } from '../model/form-field.model'
import { ReactiveForm } from '../model/reactive-form-control.model'
import { FieldSelectOption } from '../model/form-field-select-option.model'
import { FormConfigStore } from '../../form-config/service/form-config.store'

@Injectable({
  providedIn: 'root',
})
export class FormDataFormBuilderService {
  arrayComponentTypes = [
    MaterialComponentType.SELECT,
    MaterialComponentType.BUTTON_TOGGLE,
  ]

  constructor(private fb: FormBuilder, private formConfigStore: FormConfigStore) {
  }

  buildFormData(fields?: FormField[]): FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }> {
    return this.fb.group({ entries: this.fb.array((fields || []).map(it => this.buildFormField(it))) })
  }

  buildFormField(field: FormField): FormGroup {
    const formConfig = this.formConfigStore.state.data

    const defaultValue = field.multiple && this.arrayComponentTypes.includes(field.componentType)
      ? Array.isArray(field.defaultValue) ? field.defaultValue : []
      : field.defaultValue

    return this.fb.group({
      name: [field.name, Validators.required],
      label: [field.label],
      fieldType: [field.fieldType],
      componentType: [field.componentType, Validators.required],
      fields: this.fb.array(field.fields?.map(field => this.buildFormField(field)) || []),

      placeholder: [field.placeholder],
      defaultValue: [defaultValue],

      required: [field.required],
      readonly: [field.readonly],
      disabled: [field.disabled],
      hidden: [field.hidden],

      // Form Field (Input, Textarea, Select, Datepicker)
      formFieldAppearance: [field.formFieldAppearance ?? formConfig?.formFieldAppearance],
      hideRequiredMarker: [field.hideRequiredMarker ?? formConfig?.hideRequiredMarker],
      floatLabel: [field.floatLabel ?? formConfig?.floatLabel],
      hintStart: [field.hintStart],
      hintEnd: [field.hintEnd],
      subscriptSizing: [field.subscriptSizing ?? formConfig?.subscriptSizing],
      textPrefix: [field.textPrefix],
      textSuffix: [field.textSuffix],

      // Textarea
      textareaAutosize: [field.textareaAutosize ?? formConfig?.textareaAutosize],
      autosizeMinRows: [field.autosizeMinRows ?? formConfig?.textareaMinRows],
      autosizeMaxRows: [field.autosizeMaxRows ?? formConfig?.textareaMaxRows],

      // Slider
      sliderMin: [field.sliderMin],
      sliderMax: [field.sliderMax],
      sliderStep: [field.sliderStep],
      sliderDiscrete: [field.sliderDiscrete ?? formConfig?.sliderDiscrete],
      sliderShowTickMarks: [field.sliderShowTickMarks ?? formConfig?.sliderShowTickMarks],

      // Checkbox, SlideToggle, Select
      disableRipple: [field.disableRipple ?? formConfig?.disableRipple],

      // Checkbox, SlideToggle
      labelPosition: [field.labelPosition ?? formConfig?.labelPosition],
      disabledInteractive: [field.disabledInteractive ?? formConfig?.disabledInteractive],

      // SlideToggle
      slideToggleHideIcon: [field.slideToggleHideIcon ?? formConfig?.slideToggleHideIcon],

      // Select, ButtonToggle
      hideSingleSelectionIndicator: [field.hideSingleSelectionIndicator ?? formConfig?.hideSingleSelectionIndicator],

      // Select
      selectDisableOptionCentering: [field.selectDisableOptionCentering ?? formConfig?.selectDisableOptionCentering],
      selectPanelWidth: [field.selectPanelWidth],
      typeaheadDebounceInterval: [field.typeaheadDebounceInterval],
      selectAddNullOption: [field.selectAddNullOption ?? formConfig?.selectAddNullOption],

      // Select, Datepicker
      panelClass: [field.panelClass ?? formConfig?.panelClass],

      // Select, ButtonToggle
      multiple: [field.multiple],

      // Select, ButtonToggle, RadioButton
      fieldSelectOptions: this.fb.array(field.fieldSelectOptions?.map(option => this.buildFieldSelectOptionFormGroup(option)) || []),

      // Datepicker
      minDate: [field.minDate],
      maxDate: [field.maxDate],
      restoreFocus: [field.restoreFocus ?? formConfig?.datepickerRestoreFocus],
      startAt: [field.startAt],
      startView: [field.startView ?? 'month'],
      touchUi: [field.touchUi ?? formConfig?.datepickerTouchUi],
      xPosition: [field.xPosition ?? 'start'],
      yPosition: [field.yPosition ?? 'below'],
      disableDateButton: [field.disableDateButton],

      // ButtonToggle
      orientateVertical: [field.orientateVertical],
      hideMultiSelectionIndicator: [field.hideMultiSelectionIndicator ?? formConfig?.buttonToggleHideMultiSelectionIndicator],
      buttonToggleAppearance: [field.buttonToggleAppearance ?? formConfig?.buttonToggleAppearance],
    })
  }

  buildFieldSelectOptionFormGroup(option: FieldSelectOption): FormGroup {
    return this.fb.group({
      displayName: [option.displayName],
      selectableValue: [option.selectableValue],
    })
  }
}
