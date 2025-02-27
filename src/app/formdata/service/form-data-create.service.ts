import { Injectable } from '@angular/core'
import { Node, ParameterDeclaration, PropertyDeclaration, PropertySignature, SourceFile, Type } from 'ts-morph'
import { CustomFormData } from '../model/custom-form-data.model'
import { createTempSourceFile } from '../../ts-morph.utils'
import { formatLabel } from '../../common/utils'
import { FieldSelectOption } from '../model/form-field-select-option.model'
import { FieldType, FormField, MaterialComponentType } from '../model/form-field.model'
import { FormConfigStore } from '../../form-config/service/form-config.store'

@Injectable({
  providedIn: 'root',
})
export class FormDataCreateService {
  constructor(private formConfigStore: FormConfigStore) {
  }

  create(text: string, selectedType: string): CustomFormData {
    const sourceFile = createTempSourceFile(text)
    const targetType = sourceFile.getInterface(selectedType) ?? sourceFile.getClass(selectedType) ?? sourceFile.getTypeAlias(selectedType)

    return {
      selectedType: selectedType,
      typeDefinition: text,
      fields: this.getFieldsForType(targetType.getType(), sourceFile, new Set()),
    }
  }

  private getFieldsForType(type: Type, sourceFile: SourceFile, analysedClassesAndInterfaces: Set<string>): FormField[] | null {
    switch (true) {
      case analysedClassesAndInterfaces.has(type.getText()):
        console.error(`Cyclic reference detected for type ${ type.getText() }, adding placeholder instead of continuing analysis for this tree node`)
        return null
      case this.isDate(type):
        return null
      case type.isInterface():
        analysedClassesAndInterfaces.add(type.getText())
        return this.getInterfaceFields(type, sourceFile, analysedClassesAndInterfaces)
      case type.isClass():
        analysedClassesAndInterfaces.add(type.getText())
        return this.getClassFields(type, sourceFile, analysedClassesAndInterfaces)
      case this.isObject(type):
        return this.getObjectFields(type, sourceFile, analysedClassesAndInterfaces)
      case type.isIntersection():
        return type.getIntersectionTypes().flatMap(intersectionType => this.getFieldsForType(intersectionType, sourceFile, analysedClassesAndInterfaces))
      // TODO add other handlings for complex types like Union Types, Generics (Type Parameters) etc.
      default:
        return null
    }
  }

  private getInterfaceFields(type: Type, sourceFile: SourceFile, analysedClassesAndInterfaces: Set<string>): FormField[] {
    const name = type.getSymbol().getEscapedName()
    const declaration = sourceFile.getInterface(name)
    const inheritedFields = declaration.getBaseTypes().flatMap(baseType => this.getFieldsForType(baseType, sourceFile, new Set()))
    const interfaceFields = declaration.getProperties().map(property => this.createFormField(property, sourceFile, analysedClassesAndInterfaces))

    return [...interfaceFields, ...inheritedFields]
  }

  private getClassFields(type: Type, sourceFile: SourceFile, analysedClassesAndInterfaces: Set<string>): FormField[] {
    const name = type.getSymbol().getEscapedName()
    const declaration = sourceFile.getClass(name)

    const inheritedFields = declaration.getBaseTypes().flatMap(baseType => this.getFieldsForType(baseType, sourceFile, new Set()))
    const classFields = declaration.getInstanceProperties()
      .filter(it => Node.isPropertyDeclaration(it) || Node.isParameterDeclaration(it)) // filter getters and setters
      .map(property => this.createFormField(property, sourceFile, analysedClassesAndInterfaces))

    return [...classFields, ...inheritedFields]
  }

  private getObjectFields(type: Type, sourceFile: SourceFile, analysedClassesAndInterfaces: Set<string>): FormField[] {
    return type.getSymbol().getDeclarations().filter(declaration => Node.isTypeLiteral(declaration)).flatMap(declaration =>
      declaration.getMembers()
        .filter(declaration => Node.isPropertySignature(declaration))
        .map(declaration => this.createFormField(declaration, sourceFile, analysedClassesAndInterfaces)))
  }

  private createFormField(
    declaration: PropertySignature | PropertyDeclaration | ParameterDeclaration,
    sourceFile: SourceFile,
    analysedClassesAndInterfaces: Set<string>,
  ): FormField {
    const structure = declaration.getStructure()
    const propertyType = declaration.getType()
    const symbol = declaration.getSymbol()

    const options: FieldSelectOption[] | null = propertyType.isEnum()
      ? sourceFile.getEnum(propertyType.getSymbol().getName())
        .getMembers()
        .map(member => ({ displayName: member.getName(), selectableValue: member.getValue().toString() }))
      : null


    const fieldType = this.getFieldType(propertyType, analysedClassesAndInterfaces)
    return {
      name: symbol.getEscapedName(),
      label: formatLabel(symbol.getEscapedName()),
      fieldType,
      componentType: this.getDefaultComponent(fieldType),
      required: !symbol.isOptional() && !structure.hasQuestionToken && !propertyType.isNullable(), // Node.isPropertyDeclaration(property) && property.getStructure().hasExclamationToken
      readonly: structure.isReadonly || propertyType.isReadonlyArray(), // ReadonlyArray<T> gets converted to "readonly T[]" and won't be "isReadonly" anymore, therefore we also check for isReadonlyArray()
      fields: this.getFieldsForType(propertyType, sourceFile, analysedClassesAndInterfaces),
      defaultValue: structure.initializer ?? propertyType.getLiteralValue() ?? (propertyType.isBooleanLiteral() ? propertyType.getText() : null), // Boolean Literals (True, False) also act as unique type and therefore are not returned as "Literal Value", which is why we have to check manually
      fieldSelectOptions: options,
      multiple: fieldType === FieldType.ARRAY,
    }
  }

  private getFieldType(type: Type, analysedClassesAndInterfaces: Set<string>): FieldType {
    switch (true) {
      case analysedClassesAndInterfaces.has(type.getText()):
        return FieldType.CYCLIC_REFERENCE
      case this.isDate(type):
        return FieldType.DATE
      case type.isInterface():
        return FieldType.INTERFACE
      case type.isClass():
        return FieldType.CLASS
      case type.isEnum() || type.isEnumLiteral():
        return FieldType.ENUM
      case type.isArray() || type.isReadonlyArray():
        return FieldType.ARRAY
      case type.isIntersection():
        return FieldType.INTERSECTION
      case type.isObject():
        return FieldType.OBJECT
      case type.isString() || type.isStringLiteral() || type.isTemplateLiteral():
        return FieldType.STRING
      case type.isNumber() || type.isNumberLiteral():
        return FieldType.NUMBER
      case type.isBoolean() || type.isBooleanLiteral():
        return FieldType.BOOLEAN
      default:
        return FieldType.UNSUPPORTED
    }
  }

  private getDefaultComponent(fieldType: FieldType): MaterialComponentType | null {
    const defaultComponents = this.formConfigStore.state.data?.defaultComponents

    return {
      [FieldType.STRING]: defaultComponents?.string ?? MaterialComponentType.TEXT,
      [FieldType.NUMBER]: defaultComponents?.number ?? MaterialComponentType.NUMBER,
      [FieldType.BOOLEAN]: defaultComponents?.boolean ?? MaterialComponentType.CHECKBOX,
      [FieldType.ENUM]: defaultComponents?.enum ?? MaterialComponentType.SELECT,
      [FieldType.DATE]: defaultComponents?.date ?? MaterialComponentType.DATE,
      [FieldType.ARRAY]: defaultComponents?.array ?? MaterialComponentType.BUTTON_TOGGLE,
      [FieldType.UNSUPPORTED]: defaultComponents?.unsupported ?? MaterialComponentType.TEXT,

      [FieldType.INTERFACE]: null,
      [FieldType.CLASS]: null,
      [FieldType.OBJECT]: null,
      [FieldType.INTERSECTION]: null,
      [FieldType.CYCLIC_REFERENCE]: null,
    }[fieldType]
  }

  private isObject(type: Type): boolean {
    // Specifically check if the type is just an object and not any of the other typings (e.g. an array is also an object, therefore both are true)
    return type.isObject() && !type.isClassOrInterface() && !type.isArray() && !type.isReadonlyArray() && !type.isTuple()
  }

  private isDate(type: Type): boolean {
    return type.getText() === 'Date'
  }
}
