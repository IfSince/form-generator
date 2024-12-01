import { Injectable } from '@angular/core'
import { CustomFormData, FieldType, FormField, InputType } from './model/form-data.model'
import { ClassDeclaration, InterfaceDeclaration, SourceFile, Type } from 'ts-morph'
import { createTempSourceFile } from '../ts-morph.utils'

interface TypeDetails {
  fieldType: FieldType,
  fields: FormField[] | null,
  options?: { value: unknown, displayName: string }[]
  tupleFields?: FormField[] | null,
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

    if (targetType) {
      return {
        name: selectedType,
        inputType: InputType.TYPESCRIPT,
        fields: this.handleType(targetType.getType(), sourceFile).fields,
      }
    } else {
      throw new Error(`Type with name ${ selectedType } not found in given typescript snippet`)
    }
  }


  private handleType(type: Type, sourceFile: SourceFile): TypeDetails {
    if (type.isInterface()) {
      const declaration = sourceFile.getInterface(type.getSymbol().getEscapedName())
      return { fieldType: FieldType.INTERFACE, fields: this.handleClassOrInterface(declaration, sourceFile) }
    }

    if (type.isClass()) {
      const declaration = sourceFile.getClass(type.getSymbol().getEscapedName())
      return { fieldType: FieldType.CLASS, fields: this.handleClassOrInterface(declaration, sourceFile) }
    }

    if (type.isEnum()) {
      const declaration = sourceFile.getEnum(type.getSymbol()?.getName() ?? type.getText())
      return {
        fieldType: FieldType.ENUM,
        fields: null,
        options: declaration.getMembers().map(member => ({ displayName: member.getName(), value: member.getValue() })),
      }
    }

    if (type.isIntersection()) {
      return {
        fieldType: FieldType.INTERSECTION,
        fields: type.getIntersectionTypes().flatMap(intersectionType => this.handleType(intersectionType, sourceFile).fields),
      }
    }

    if (type.isUnion()) return { fieldType: FieldType.UNION, fields: null }

    if (type.isTuple()) {
      const tupleFields = type.getTupleElements().map(tupleType => {
        const { fieldType, fields, options } = this.handleType(tupleType, sourceFile)
        return {
          name: tupleType.getText(),
          fieldType,
          originalTypeName: tupleType.getText(),
          nestedFields: fields,
          inheritedFields: null,
          options,
        }
      })

      return { fieldType: FieldType.TUPLE, tupleFields, fields: null }
    }


    if (type.isArray() || type.isReadonlyArray()) return { fieldType: FieldType.ARRAY, fields: null }

    if (type.isObject()) {
      const properties = type.getProperties()
      const fields = properties.map(property => {
        const propertyType = property.getValueDeclaration().getType()

        const { fieldType, fields, options } = this.handleType(propertyType, sourceFile)

        return {
          name: property.getName(),
          fieldType,
          originalTypeName: propertyType.getText(),
          nestedFields: fields,
          inheritedFields: null,
          options,
        }
      })

      return { fieldType: FieldType.OBJECT, fields: fields }
    }


    if (type.isNumber() || type.isNumberLiteral()) return { fieldType: FieldType.NUMBER, fields: null }
    if (type.isString() || type.isStringLiteral()) return { fieldType: FieldType.STRING, fields: null }
    if (type.isBoolean() || type.isBooleanLiteral()) return { fieldType: FieldType.BOOLEAN, fields: null }

    return { fieldType: FieldType.UNKNOWN, fields: null }
  }


  handleClassOrInterface(declaration: InterfaceDeclaration | ClassDeclaration, sourceFile: SourceFile): FormField[] {
    const properties = declaration instanceof InterfaceDeclaration ? declaration.getProperties() : declaration.getInstanceProperties()
    const inheritedTypes = declaration.getBaseTypes()

    const baseFields = properties.map((property) => {
      const type = property.getType()

      const { fieldType, fields, options, tupleFields } = this.handleType(type, sourceFile)

      return {
        name: property.getName(),
        fieldType: fieldType,
        originalTypeName: type.getText(),
        nestedFields: fields,
        inheritedFields: null,
        options,
        tupleFields,
      }
    })

    const inheritedFields = inheritedTypes.map(type => {
      const { fieldType, fields, options, tupleFields } = this.handleType(type, sourceFile)

      return {
        name: `Inherits: ${ type.getText() }`,
        fieldType: fieldType,
        originalTypeName: type.getText(),
        nestedFields: null,
        inheritedFields: fields,
        options,
        tupleFields,
      }
    })

    // return [...baseFields, ...inheritedFields.flatMap(it => [...it.nestedFields ?? [], ...it.inheritedFields ?? []])]
    return [...baseFields, ...inheritedFields]
  }
}
