import { Project, Type } from 'ts-morph'

export const project = new Project({ useInMemoryFileSystem: true, compilerOptions: { strict: true, strictNullChecks: false } })

export const createTempSourceFile = (text: string) => project.createSourceFile('temp.ts', text, { overwrite: true })

export const getAvailableTypes = (text: string) => {
  const src = createTempSourceFile(text)
  const interfaces = src.getInterfaces()
  const classes = src.getClasses()
  const typeAliases = src.getTypeAliases()
  const enums = src.getEnums()

  return { interfaces, classes, typeAliases, enums }
}

export const logType = (type: Type) => {
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
