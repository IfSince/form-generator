import { Injectable } from '@angular/core'
import { Node, ParameterDeclaration, PropertyDeclaration, PropertySignature, SourceFile, Type } from 'ts-morph'
import { CustomFormData, InputType } from '../model/custom-form-data.model'
import { createTempSourceFile } from '../../ts-morph.utils'
import { FieldType, FormField } from '../model/form-field.model'

@Injectable({
  providedIn: 'root',
})
export class FormDataCreateByTypeScriptService {
  constructor() {
  }

  create(text: string, selectedType: string): CustomFormData {
    const sourceFile = createTempSourceFile(text)
    const targetType = sourceFile.getInterface(selectedType) ?? sourceFile.getClass(selectedType) ?? sourceFile.getTypeAlias(selectedType)

    return {
      name: selectedType,
      inputType: InputType.TYPESCRIPT,
      fields: this.getFormFieldsForType(targetType.getType(), sourceFile),
    }
  }

  private getFormFieldsForType(type: Type, sourceFile: SourceFile, alreadyReferenced: Set<string> = new Set()): FormField[] | null {
    if (alreadyReferenced.has(type.getText())) {
      console.log(`Cyclic reference detected for type ${ type.getText() }, adding placeholder instead of continuing analysis for this tree node`)
      return null
    }

    if (type.isInterface()) {
      alreadyReferenced.add(type.getText())

      const name = type.getSymbol().getEscapedName()
      const declaration = sourceFile.getInterface(name)

      const inheritedFields = declaration.getBaseTypes().flatMap(baseType => this.getFormFieldsForType(baseType, sourceFile, new Set()))
      const interfaceFields = declaration.getProperties().map(property => this.createFormField(property, sourceFile, alreadyReferenced))

      return [...interfaceFields, ...inheritedFields]
    }

    if (type.isClass()) {
      alreadyReferenced.add(type.getText())

      const name = type.getSymbol().getEscapedName()
      const declaration = sourceFile.getClass(name)

      const inheritedFields = declaration.getBaseTypes().flatMap(baseType => this.getFormFieldsForType(baseType, sourceFile, new Set()))
      const classFields = declaration.getInstanceProperties()
        .filter(it => Node.isPropertyDeclaration(it) || Node.isParameterDeclaration(it)) // filter getters and setters
        .map(property => this.createFormField(property, sourceFile, alreadyReferenced))

      return [...classFields, ...inheritedFields]
    }

    if (this.isObject(type)) {
      return type.getSymbol().getDeclarations().filter(declaration => Node.isTypeLiteral(declaration)).flatMap(declaration =>
        declaration.getMembers()
          .filter(declaration => Node.isPropertySignature(declaration))
          .map(declaration => this.createFormField(declaration, sourceFile, alreadyReferenced)))
    }

    if (type.isIntersection()) {
      return type.getIntersectionTypes().flatMap(intersectionType => this.getFormFieldsForType(intersectionType, sourceFile, alreadyReferenced))
    }

    // TODO add other handlings for currently unsupported types like Union Types, Generics. etc.

    return null
  }

  private createFormField(
    property: PropertySignature | PropertyDeclaration | ParameterDeclaration,
    sourceFile: SourceFile,
    alreadyReferenced: Set<string>,
  ): FormField {
    const structure = property.getStructure()
    const propertyType = property.getType()
    const symbol = property.getSymbol()

    return {
      name: symbol.getEscapedName(),
      fieldType: this.getFieldTypeForType(propertyType, alreadyReferenced),
      fields: this.getFormFieldsForType(propertyType, sourceFile, alreadyReferenced),
      isRequired: Node.isPropertyDeclaration(property) && property.getStructure().hasExclamationToken,
      isOptional: symbol.isOptional() || structure.hasQuestionToken || propertyType.isNullable(),
      isReadonly: structure.isReadonly || propertyType.isReadonlyArray(), // ReadonlyArray<T> gets converted to "readonly T[]" and wont be "isReadonly" anymore, therefore we also check for isReadonlyArray()
      defaultValue: structure.initializer
      ?? propertyType.getLiteralValue()
      // Boolean Literals (True, False) also act as unique type and therefore are not returned as "Literal Value", which is why we have to check manually
      ?? propertyType.isBooleanLiteral() ? propertyType.getText() : null,
      options: propertyType.isEnum()
        ? sourceFile.getEnum(propertyType.getSymbol().getName()).getMembers().map(member => ({ displayName: member.getName(), value: member.getValue() }))
        : null,
      originalType: propertyType.getText(),
    }
  }

  private getFieldTypeForType(type: Type, alreadyReferenced: Set<string>): FieldType {
    // logType(type)
    switch (true) {
      case alreadyReferenced.has(type.getText()):
        return FieldType.CYCLIC_REFERENCE
      case type.isInterface():
        return FieldType.INTERFACE
      case type.isClass():
        return FieldType.CLASS
      case type.isEnum() || type.isEnumLiteral():
        return FieldType.ENUM
      case type.isArray() && type.isReadonlyArray():
        return FieldType.ARRAY
      case type.isTuple():
        return FieldType.TUPLE
      case type.isIntersection():
        return FieldType.INTERSECTION
      case type.isUnion() && !type.isBoolean():
        return FieldType.UNION
      case this.isObject(type):
        return FieldType.OBJECT
      case type.isString() || type.isStringLiteral() || type.isTemplateLiteral():
        return FieldType.STRING
      case type.isNumber() || type.isNumberLiteral():
        return FieldType.NUMBER
      case type.isBoolean() || type.isBooleanLiteral():
        return FieldType.BOOLEAN
      case type.isUnknown():
        return FieldType.UNKNOWN
      case type.isNever() || type.isVoid() || type.isNull() || type.isUndefined():
        return FieldType.NOT_RENDERED
      case type.isAny():
        return FieldType.ANY
      case type.isTypeParameter():
        return FieldType.TYPE_PARAMETER
      default:
        return FieldType.NOT_SUPPORTED
    }
  }

  private isObject(type: Type): boolean {
    // Specifically check if the type is just an object and not any of the other typings (e.g. an array is also an object, therefore both are true)
    return type.isObject() && !type.isClassOrInterface() && !type.isArray() && !type.isReadonlyArray() && !type.isTuple()
  }
}
