import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'
import { MatCardActions } from '@angular/material/card'
import { AbstractSubmitComponent } from '../../common/component/abstract-submit.component'
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { getAvailableTypes } from '../../ts-morph.utils'
import { MatTooltip } from '@angular/material/tooltip'
import { distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-typescript-input',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatCardActions,
    MatSelect,
    MatOption,
    MatLabel,
    MatOptgroup,
    MatTooltip,
  ],
  templateUrl: './typescript-input.component.html',
  styleUrl: './typescript-input.component.css',
})
export class TypescriptInputComponent extends AbstractSubmitComponent<{ text: string, selectedType?: string }> {
  _control = new FormGroup({
    text: new FormControl<string | null>(null, [Validators.required]),
    selectedType: new FormControl<string | null>({ value: null, disabled: true }),
  })

  selectableTypes = signal<{ interfaces: string[], classes: string[], typeAliases: string[] }>({
    interfaces: [],
    classes: [],
    typeAliases: [],
  })

  constructor() {
    super()

    this._control.controls.text.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(text => {
      const availableTypes = text ? getAvailableTypes(text) : null
      const options = {
        interfaces: availableTypes?.interfaces?.map(it => it.getName()) ?? [],
        classes: availableTypes?.classes?.map(it => it.getName()!!) ?? [],
        typeAliases: availableTypes?.typeAliases?.map(it => it.getName()) ?? [],
      }

      this.selectableTypes.set(options)

      if (options.interfaces.length > 0 || options.classes.length > 0 || options.typeAliases.length > 0) {
        this._control.controls.selectedType.enable()
        this._control.controls.selectedType.patchValue(options.interfaces[0] ?? options.classes[0] ?? options.typeAliases[0])
      } else {
        this._control.controls.selectedType.patchValue(null)
        this._control.controls.selectedType.disable()
      }
    })
  }
}
