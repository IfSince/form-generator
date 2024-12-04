import { Project } from 'ts-morph'

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
