import { Component, OnInit, signal } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatSelect } from '@angular/material/select'
import { MatTooltip } from '@angular/material/tooltip'
import { distinctUntilChanged, filter, takeUntil } from 'rxjs'
import { ClassDeclaration, InterfaceDeclaration, SourceFile, TypeAliasDeclaration } from 'ts-morph'
import { map } from 'rxjs/operators'
import { isTypeNode, createSourceFileAndGetAvailableTypes } from '../../../ts-morph.utils'
import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { DropzoneCdkModule } from '@ngx-dropzone/cdk'
import { MatCardModule } from '@angular/material/card'
import { AbstractFormComponent } from '../../../common/component/abstract-form.component'
import { ReactiveForm } from '../../../formdata/model/reactive-form-control.model'
import { MatOptgroup, MatOption } from '@angular/material/core'

export interface TypeScriptInput {
  typeDefinition: string | null
  selectedType: string | null
}

@Component({
  selector: 'app-upload-form-component',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatOptgroup,
    MatTooltip,
    CdkTextareaAutosize,
    DropzoneCdkModule,
    MatCardModule,
    MatError,
  ],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css',
})
export class UploadFormComponent extends AbstractFormComponent<TypeScriptInput> implements OnInit {
  _formGroup: FormGroup<ReactiveForm<TypeScriptInput>>

  selectableTypes = signal<{ interfaces: string[], classes: string[], typeAliases: string[] }>({
    interfaces: [],
    classes: [],
    typeAliases: [],
  })

  ngOnInit(): void {
    const { interfaces, classes, typeAliases } = createSourceFileAndGetAvailableTypes(this._formGroup.getRawValue().typeDefinition)
    this.setSelectableTypes(interfaces, classes, typeAliases)
  }

  override valueChangesSubscription() {
    return this._formGroup.controls.typeDefinition.valueChanges.pipe(
      filter(Boolean),
      map(createSourceFileAndGetAvailableTypes),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
    ).subscribe(({ classes, interfaces, sourceFile, typeAliases }) => {
      this.setSelectableTypes(interfaces, classes, typeAliases)

      if (classes.length > 0 || interfaces.length > 0 || typeAliases.length > 0) {
        this._formGroup.controls.selectedType.patchValue(this.determineDefaultType(sourceFile))
      } else {
        this._formGroup.controls.selectedType.patchValue(null)
      }

    })
  }

  private setSelectableTypes(interfaces: InterfaceDeclaration[], classes: ClassDeclaration[], typeAliases: TypeAliasDeclaration[]) {
    const options = {
      interfaces: interfaces?.map(it => it.getName()) ?? [],
      classes: classes?.map(it => it.getName()).filter(it => it != null) ?? [],
      typeAliases: typeAliases?.map(it => it.getName()) ?? [],
    }

    this.selectableTypes.set(options)
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
  private determineDefaultType(sourceFile: SourceFile): string {
    const defaultExportTypeName = sourceFile.getDefaultExportSymbol()?.getDeclarations().find(isTypeNode)?.getName()
    if (defaultExportTypeName) return defaultExportTypeName

    const exportedTypeName = [...sourceFile.getExportedDeclarations()]
      .flatMap(([name, declarations]) => declarations.filter(isTypeNode).map(() => name))
      .at(-1)

    return exportedTypeName ?? sourceFile.getStatements().reverse().find(isTypeNode)?.getName()!!
  }
}
