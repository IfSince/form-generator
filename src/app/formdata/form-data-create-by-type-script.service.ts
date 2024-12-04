import { Injectable } from '@angular/core'
import { CustomFormData, FieldSelectOption, FieldType } from './model/form-data.model'
import { Node, ParameterDeclaration, PropertyDeclaration, PropertySignature, SourceFile, Type } from 'ts-morph'
import { createTempSourceFile } from '../ts-morph.utils'

const logType = (type: Type) => {
  console.log({
    text: type.getText(),
    isInterface: type.isInterface(),
    isClass: type.isClass(),
    isEnum: type.isEnum(),
    isEnumLiteral: type.isEnumLiteral(),
    isObject: type.isObject(),
    isArray: type.isArray(),
    isReadonlyArray: type.isReadonlyArray(),
    isTuple: type.isTuple(),
    isUnion: type.isUnion(),
    isIntersection: type.isIntersection(),
    isNumber: type.isNumber(),
    isNumberLiteral: type.isNumberLiteral(),
    isString: type.isString(),
    isStringLiteral: type.isStringLiteral(),
    isBoolean: type.isBoolean(),
    isBooleanLiteral: type.isBooleanLiteral(),
    isTypeParameter: type.isTypeParameter(),
    isNull: type.isNull(),
    isUndefined: type.isUndefined(),
    isLiteral: type.isLiteral(),
    isBigInt: type.isBigInt(),
    isBigIntLiteral: type.isBigIntLiteral(),
    isNever: type.isNever(),
    isUnknown: type.isUnknown(),
    isTemplateLiteral: type.isTemplateLiteral(),
    isAny: type.isAny(),
    isVoid: type.isVoid(),
  })
}

interface TypeData {
  fieldType: FieldType,
  originalType: string,
  fields: TypeData[],
  name: string,
  baseTypes: any[],
  isNullable: boolean,
  hasExclamationToken: boolean,
  hasQuestionToken: boolean,
  // hasFixedValue: boolean,
  isOptional: boolean,
  isReadonly: boolean,
  initializer: unknown,
  literal: unknown,
  options: FieldSelectOption[]
}

interface TypeData2 {
  name: string,
  fieldType: FieldType,

  isOptional: boolean,
  isReadonly: boolean,
  defaultValue?: unknown,
  options?: FieldSelectOption[],

  fields: TypeData2[],
  originalType: string,
}

@Injectable({
  providedIn: 'root',
})
export class FormDataCreateByTypeScriptService {
  constructor() {
  }

  create(text: string, selectedType?: string): CustomFormData {
    const sourceFile = createTempSourceFile(text)
    const targetType = sourceFile.getInterface(selectedType) ?? sourceFile.getClass(selectedType) ?? sourceFile.getTypeAlias(selectedType)

    const result = this.handleType3(targetType.getType(), sourceFile)

    console.log('Result', result)

    return {} as CustomFormData
  }

  // ggf. so anpassen, dass nicht type sondern declaration übergeben wird
  private handleType3(type: Type, sourceFile: SourceFile, alreadyReferenced: Set<string> = new Set()): TypeData[] | null {
    if (alreadyReferenced.has(type.getText())) {
      console.log(`Cyclic reference detected for type ${ type.getText() }, adding placeholder instead of continuing analysis for this tree node`)
      return null
    }

    if (type.isInterface()) {
      alreadyReferenced.add(type.getText())

      const name = type.getSymbol().getEscapedName()
      const declaration = sourceFile.getInterface(name)
      const properties = declaration.getProperties()
      const baseTypes = declaration.getBaseTypes()

      const inheritedFields = baseTypes.flatMap(baseType => this.handleType3(baseType, sourceFile, new Set()))
      const parsedProperties: TypeData[] = properties.map(property => this.createTypeData(property, sourceFile, alreadyReferenced))

      return [...parsedProperties, ...inheritedFields]
    }

    if (type.isClass()) {
      alreadyReferenced.add(type.getText())

      const name = type.getSymbol().getEscapedName()
      const declaration = sourceFile.getClass(name)
      const instanceProperties = declaration.getInstanceProperties()
      const baseTypes = declaration.getBaseTypes()

      const inheritedFields = baseTypes.flatMap(baseType => this.handleType3(baseType, sourceFile, new Set()))

      const parsedInstanceProperties: TypeData[] = instanceProperties
        .filter(it => Node.isPropertyDeclaration(it) || Node.isParameterDeclaration(it)) // filter getters and setters
        .map(property => this.createTypeData(property, sourceFile, alreadyReferenced))

      return [...parsedInstanceProperties, ...inheritedFields]
    }

    if (this.isObject(type)) {
      const declarations = type.getSymbol().getDeclarations()

      return declarations.filter(declaration => Node.isTypeLiteral(declaration)).flatMap(declaration =>
        declaration.getMembers()
          .filter(declaration => Node.isPropertySignature(declaration))
          .map(declaration => this.createTypeData(declaration, sourceFile, alreadyReferenced)))
    }

    if (type.isIntersection()) {
      return type.getIntersectionTypes().flatMap(intersectionType => this.handleType3(intersectionType, sourceFile, alreadyReferenced))
    }

    return null
  }

  private createTypeData(
    property: PropertySignature | PropertyDeclaration | ParameterDeclaration,
    sourceFile: SourceFile,
    alreadyReferenced: Set<string>,
  ): TypeData {
    const structure = property.getStructure()
    const propertyType = property.getType()
    const symbol = property.getSymbol()

    const options = propertyType.isEnum()
      ? sourceFile.getEnum(propertyType.getSymbol().getName()).getMembers().map(member => ({ displayName: member.getName(), value: member.getValue() }))
      : null

    return {
      fieldType: this.getFieldTypeForType(propertyType, alreadyReferenced),
      originalType: propertyType.getText(),
      name: symbol.getEscapedName(),
      baseTypes: propertyType.getBaseTypes(),
      isNullable: propertyType.isNullable(),
      hasExclamationToken: Node.isPropertyDeclaration(property) && property.getStructure().hasExclamationToken,
      hasQuestionToken: structure.hasQuestionToken,
      isOptional: symbol.isOptional(),
      isReadonly: structure.isReadonly || propertyType.isReadonlyArray(), // ReadonlyArray<T> gets converted to "readonly T[]"
      initializer: structure.initializer,
      literal: structure.initializer ?? propertyType.getLiteralValue() ?? propertyType.isBooleanLiteral() ? propertyType.getText() : null,
      fields: this.handleType3(propertyType, sourceFile, alreadyReferenced),
      options,
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
    return type.isObject() && !type.isClassOrInterface() && !type.isArray() && !type.isReadonlyArray() && !type.isTuple()
  }
}
