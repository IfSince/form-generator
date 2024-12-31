import { Component, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'
import { MatCardActions } from '@angular/material/card'
import { MatOptgroup, MatOption, MatSelect } from '@angular/material/select'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatTooltip } from '@angular/material/tooltip'
import { distinctUntilChanged, filter } from 'rxjs'
import { SourceFile } from 'ts-morph'
import { map } from 'rxjs/operators'
import { AbstractSubmitComponent } from '../../../common/component/abstract-submit.component'
import { isTypeNode, parseAsSourceFileWithAvailableTypes } from '../../../ts-morph.utils'

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
export class TypescriptInputComponent extends AbstractSubmitComponent<{ text: string, selectedType: string }> {
  _control = new FormGroup({
    text: new FormControl<string | null>(null, [Validators.required]),
    selectedType: new FormControl<string | null>(null, [Validators.required]),
  })

  selectableTypes = signal<{ interfaces: string[], classes: string[], typeAliases: string[] }>({
    interfaces: [],
    classes: [],
    typeAliases: [],
  })

  constructor() {
    super()

    this._control.controls.text.valueChanges.pipe(
      filter(Boolean),
      map(parseAsSourceFileWithAvailableTypes),
      distinctUntilChanged(), // TODO doesnt work yet, probably refactor parseAsSourceFileWithAvailableTypes to specifically return needed info instead of doing stuff here
      takeUntilDestroyed(),
    ).subscribe(({ classes, interfaces, sourceFile, typeAliases }) => {
      const options = {
        interfaces: interfaces?.map(it => it.getName()) ?? [],
        classes: classes?.map(it => it.getName()).filter(it => it != null) ?? [],
        typeAliases: typeAliases?.map(it => it.getName()) ?? [],
      }

      this.selectableTypes.set(options)

      if (classes.length > 0 || interfaces.length > 0 || typeAliases.length > 0) {
        this._control.controls.selectedType.patchValue(this.determineDefaultType(sourceFile))
      } else {
        this._control.controls.selectedType.patchValue(null)
      }

    })
  }

  /**
   * Supported types: Interfaces, Classes and Type Alias
   *
   * Determine the default selected type for source file with the following priority:
   *
   * 1. Default Export
   * 2. Last type with export declaration
   * 3. Last type
   * 4. Null (no supported types found)
   */
  determineDefaultType(sourceFile: SourceFile): string {
    const defaultExportTypeName = sourceFile.getDefaultExportSymbol()?.getDeclarations().find(isTypeNode)?.getName()
    if (defaultExportTypeName) return defaultExportTypeName

    const exportedTypeName = [...sourceFile.getExportedDeclarations()]
      .flatMap(([name, declarations]) => declarations.filter(isTypeNode).map(() => name))
      .at(-1)

    return exportedTypeName ?? sourceFile.getStatements().reverse().find(isTypeNode)?.getName()!!
  }
}
