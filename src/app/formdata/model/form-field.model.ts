import { FieldSelectOption } from './form-field-select-option.model'

export enum FieldType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  ENUM = 'ENUM',

  DATE = 'DATE',

  ARRAY = 'ARRAY', // zusätzlich das Element auswählen, welches für Array angezeigt werden soll (Default könnte Primitiver Typ/String sein), Alternativ natürlich Multiselect
  // TUPLE = 'TUPLE', // ggf. wenn alle literals sind als chips z. b.

  INTERFACE = 'INTERFACE',
  CLASS = 'CLASS',
  OBJECT = 'OBJECT',
  INTERSECTION = 'INTERSECTION',

  CYCLIC_REFERENCE = 'CYCLIC_REFERENCE',
  UNSUPPORTED = 'UNSUPPORTED',
}

export enum MaterialComponentType {
  /* ---------- String ----------*/
  TEXT = 'Text',
  TEXTAREA = 'Textarea',
  EMAIL = 'Email',
  COLOR = 'Color',
  PASSWORD = 'Password',
  TELEPHONE = 'Telephone',
  URL = 'Url',

  /* ---------- Number ----------*/
  NUMBER = 'Number',
  SLIDER = 'Slider',

  /* ---------- Boolean ----------*/
  CHECKBOX = 'Checkbox',
  SLIDE_TOGGLE = 'SlideToggle',

  /* ---------- Enum ----------*/
  SELECT = 'Select',
  RADIO_BUTTON = 'RadioButton',

  /* ---------- Date ----------*/
  DATE = 'Date',
  DATETIME_LOCAL = 'DatetimeLocal',
  TIME = 'Time',
  WEEK = 'Week',
  MONTH = 'Month',

  /* ---------- Array ----------*/
  BUTTON_TOGGLE = 'ButtonToggle',
  // CHIPS = 'Chips',
}

export const FIELD_TYPE_TO_MATERIAL_FIELD_DEFAULTS: Record<FieldType, MaterialComponentType | null> = {
  [FieldType.STRING]: MaterialComponentType.TEXT,
  [FieldType.NUMBER]: MaterialComponentType.NUMBER,
  [FieldType.BOOLEAN]: MaterialComponentType.CHECKBOX,
  [FieldType.ENUM]: MaterialComponentType.SELECT,
  [FieldType.DATE]: MaterialComponentType.DATE,
  [FieldType.ARRAY]: MaterialComponentType.BUTTON_TOGGLE,

  [FieldType.INTERFACE]: null,
  [FieldType.CLASS]: null,
  [FieldType.OBJECT]: null,
  [FieldType.INTERSECTION]: null,
  [FieldType.CYCLIC_REFERENCE]: null,
  [FieldType.UNSUPPORTED]: null,
}

export const MATERIAL_INPUT_COMPONENT_TYPES = [
  MaterialComponentType.COLOR,
  MaterialComponentType.DATETIME_LOCAL,
  MaterialComponentType.EMAIL,
  MaterialComponentType.MONTH,
  MaterialComponentType.NUMBER,
  MaterialComponentType.PASSWORD,
  MaterialComponentType.TELEPHONE,
  MaterialComponentType.TEXT,
  MaterialComponentType.TIME,
  MaterialComponentType.URL,
  MaterialComponentType.WEEK,
  MaterialComponentType.WEEK,

]

export interface FormField {
  name: string
  label: string
  fieldType: FieldType,
  componentType: MaterialComponentType
  fields?: FormField[],


  // id?: string
  // class?: string // idea: only able to be set through configurations (classes to be applied to all fields)

  defaultValue?: any
  placeholder?: string

  required: boolean
  readonly: boolean
  disabled: boolean
  hidden: boolean

  // Form Field (Input, Textarea, Select, Datepicker)
  formFieldAppearance?: 'fill' | 'outline'
  hideRequiredMarker?: boolean
  floatLabel?: 'always' | 'auto'
  hintStart?: string
  hintEnd?: string
  subscriptSizing?: 'fixed' | 'dynamic'
  // prefix?: any
  // suffix?: any
  textPrefix?: string
  textSuffix?: string

  // Textarea
  textareaAutosize?: boolean
  autosizeMinRows?: number
  autosizeMaxRows?: number

  // Slider
  // range
  sliderMin?: number
  sliderMax?: number
  sliderStep?: number
  sliderDiscrete?: boolean // whether slider thumb shows value
  sliderShowTickMarks?: boolean // whether to show tick marks

  // Checkbox, SlideToggle, RadioButton, Select
  disableRipple?: boolean

  // Checkbox, SlideToggle, RadioButton
  disabledInteractive?: boolean
  labelPosition?: 'before' | 'after'

  // SlideToggle
  slideToggleHideIcon?: boolean

  // Select, Button Toggle
  hideSingleSelectionIndicator?: boolean

  // Select
  selectDisableOptionCentering?: boolean
  selectPanelWidth?: string | number | null
  typeaheadDebounceInterval?: number
  selectAddNullOption?: boolean

  // Select, Datepicker
  panelClass?: string

  // Select, ButtonToggle
  multiple?: boolean // determines whether multiple options can be selected (e.g. for SELECT, BUTTON_TOGGLE, CHIPS)

  // RadioButton, Select, ButtonToggle
  fieldSelectOptions?: FieldSelectOption[],

  // Datepicker
  minDate?: string,
  maxDate?: string,
  restoreFocus?: boolean
  startAt?: string
  startView?: 'month' | 'year' | 'multi-year'
  touchUi?: boolean
  xPosition?: 'start' | 'end'
  yPosition?: 'above' | 'below'
  disableDateButton?: boolean

  // ButtonToggle
  orientateVertical?: boolean
  hideMultiSelectionIndicator?: boolean
  buttonToggleAppearance?: 'legacy' | 'standard'
}
