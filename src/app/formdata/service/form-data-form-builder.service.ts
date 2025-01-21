import { Injectable } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormField, MaterialComponentType } from '../model/form-field.model'
import { ReactiveForm } from '../model/reactive-form-control.model'
import { FieldSelectOption } from '../model/form-field-select-option.model'

@Injectable({
  providedIn: 'root',
})
export class FormDataFormBuilderService {

  constructor(
    private fb: FormBuilder,
  ) {
  }

  buildFormData(fields?: FormField[]): FormGroup<{ entries: FormArray<FormGroup<ReactiveForm<FormField>>> }> {
    return this.fb.group({ entries: this.fb.array((fields || []).map(it => this.buildFormField(it))) })
  }

  arrayComponentTypes = [
    MaterialComponentType.SELECT,
    MaterialComponentType.BUTTON_TOGGLE,
  ]

  buildFormField(field: FormField): FormGroup {
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
      formFieldAppearance: [field.formFieldAppearance ?? 'fill'],
      hideRequiredMarker: [field.hideRequiredMarker],
      floatLabel: [field.floatLabel ?? 'auto'],
      hintStart: [field.hintStart],
      hintEnd: [field.hintEnd],
      subscriptSizing: [field.subscriptSizing ?? 'fixed'],
      textPrefix: [field.textPrefix],
      textSuffix: [field.textSuffix],

      // Textarea
      textareaAutosize: [field.textareaAutosize],
      autosizeMinRows: [field.autosizeMinRows],
      autosizeMaxRows: [field.autosizeMaxRows],

      // Slider
      sliderMin: [field.sliderMin],
      sliderMax: [field.sliderMax],
      sliderStep: [field.sliderStep],
      sliderDiscrete: [field.sliderDiscrete],
      sliderShowTickMarks: [field.sliderShowTickMarks],

      // Checkbox, SlideToggle, Select
      disableRipple: [field.disableRipple],

      // Checkbox, SlideToggle
      labelPosition: [field.labelPosition ?? 'after'],
      disabledInteractive: [field.disabledInteractive],

      // SlideToggle
      slideToggleHideIcon: [field.slideToggleHideIcon],

      // Select, ButtonToggle
      hideSingleSelectionIndicator: [field.hideSingleSelectionIndicator],

      // Select
      selectDisableOptionCentering: [field.selectDisableOptionCentering],
      selectPanelWidth: [field.selectPanelWidth ?? 'auto'],
      typeaheadDebounceInterval: [field.typeaheadDebounceInterval],
      selectAddNullOption: [field.selectAddNullOption],

      // Select, Datepicker
      panelClass: [field.panelClass],

      // Select, ButtonToggle
      multiple: [field.multiple],

      // Select, ButtonToggle, RadioButton
      fieldSelectOptions: this.fb.array(field.fieldSelectOptions?.map(option => this.buildFieldSelectOptionFormGroup(option)) || []),

      // Datepicker
      minDate: [field.minDate],
      maxDate: [field.maxDate],
      restoreFocus: [field.restoreFocus],
      startAt: [field.startAt],
      startView: [field.startView ?? 'month'],
      touchUi: [field.touchUi],
      xPosition: [field.xPosition ?? 'start'],
      yPosition: [field.yPosition ?? 'below'],
      disableDateButton: [field.disableDateButton],

      // ButtonToggle
      orientateVertical: [field.orientateVertical],
      hideMultiSelectionIndicator: [field.hideMultiSelectionIndicator],
      buttonToggleAppearance: [field.buttonToggleAppearance ?? 'standard'],
    })
  }

  buildFieldSelectOptionFormGroup(option: FieldSelectOption): FormGroup {
    return this.fb.group({
      displayName: [option.displayName],
      selectableValue: [option.selectableValue],
    })
  }
}
