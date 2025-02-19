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

export const MATERIAL_COMPONENT_OPT_GROUPS = [
  {
    groupName: 'String',
    components: [
      MaterialComponentType.TEXT,
      MaterialComponentType.TEXTAREA,
      MaterialComponentType.EMAIL,
      MaterialComponentType.COLOR,
      MaterialComponentType.PASSWORD,
      MaterialComponentType.TELEPHONE,
      MaterialComponentType.URL,
    ],
  },
  {
    groupName: 'Number',
    components: [
      MaterialComponentType.NUMBER,
      MaterialComponentType.SLIDER,
    ],
  },
  {
    groupName: 'Boolean',
    components: [
      MaterialComponentType.CHECKBOX,
      MaterialComponentType.SLIDE_TOGGLE,
    ],
  },
  {
    groupName: 'Enum',
    components: [
      MaterialComponentType.SELECT,
      MaterialComponentType.RADIO_BUTTON,
    ],
  },
  {
    groupName: 'Date / Time',
    components: [
      MaterialComponentType.DATE,
      MaterialComponentType.DATETIME_LOCAL,
      MaterialComponentType.TIME,
      MaterialComponentType.WEEK,
      MaterialComponentType.MONTH,
    ],
  },
  {
    groupName: 'Array',
    components: [
      MaterialComponentType.BUTTON_TOGGLE,
      // MaterialComponentType.CHIPS,
    ],
  },
]

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
  label?: string
  fieldType: FieldType,
  componentType?: MaterialComponentType // null if wrapper field (nested fields, e.g.)
  fields?: FormField[],

  defaultValue?: any
  placeholder?: string

  required?: boolean
  readonly?: boolean
  disabled?: boolean
  hidden?: boolean

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
