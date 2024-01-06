import { join } from 'path'
const fs = require('fs')
import {
  createCommonDtosFile,
  createCommonDtosFileRest,
  createComponentNames,
  createFolderIfNotPresent,
} from '../util'
import {
  createEntityFile,
  createInputDtoFile,
  createResolverFile,
  createServiceFile,
  findInputDtoFile,
  orderByInputDtoFile,
  updateInputDtoFile,
  whereInputDtoFile,
} from '../templates/graphql'

import {
  createEntityFileRest,
  createInputDtoFileRest,
  createControllerFileRest,
  updateInputDtoFileRest,
  queryDtoFileRest,
  commonDtosFileRest,
} from '../templates/rest'
import { createCompleteModuleFile } from '../templates/complete'

export const createCompleteFiles = () => {
  const [componentName] = process.argv.slice(3, 4)
  console.log('Generating files...', componentName)

  createCommonDtosFile()
  createCommonDtosFileRest()

  if (!componentName) {
    console.error(`

    Please provide a resource name


    `)
    process.exit(1)
  }

  const names = createComponentNames(componentName)

  const modelsFolder = 'src/models'
  createFolderIfNotPresent(modelsFolder)

  const { kebabPlural, kebab } = names
  const targetDir = join(process.cwd(), 'src/models', kebabPlural)

  fs.mkdirSync(`${targetDir}`)

  fs.writeFileSync(
    `${targetDir}/${kebabPlural}.module.ts`,
    createCompleteModuleFile(names),
  )

  // Graphql

  const targetDirGraphql = join(targetDir, '/graphql')
  fs.mkdirSync(`${targetDirGraphql}`)
  fs.mkdirSync(`${targetDirGraphql}/dtos`)
  fs.mkdirSync(`${targetDirGraphql}/entity`)

  fs.writeFileSync(
    `${targetDirGraphql}/${kebabPlural}.resolver.ts`,
    createResolverFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/${kebabPlural}.service.ts`,
    createServiceFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/dtos/create-${kebab}.input.ts`,
    createInputDtoFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/dtos/update-${kebab}.input.ts`,
    updateInputDtoFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/dtos/find.args.ts`,
    findInputDtoFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/dtos/order-by.args.ts`,
    orderByInputDtoFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/dtos/where.args.ts`,
    whereInputDtoFile(names),
  )
  fs.writeFileSync(
    `${targetDirGraphql}/entity/${kebab}.entity.ts`,
    createEntityFile(names),
  )

  /**
   * Rest
   */

  const targetDirRest = join(targetDir, '/rest')

  fs.mkdirSync(`${targetDirRest}`)
  fs.mkdirSync(`${targetDirRest}/dtos`)
  fs.mkdirSync(`${targetDirRest}/entity`)

  fs.writeFileSync(
    `${targetDirRest}/${kebabPlural}.controller.ts`,
    createControllerFileRest(names),
  )

  fs.writeFileSync(
    `${targetDirRest}/dtos/create.dto.ts`,
    createInputDtoFileRest(names),
  )
  fs.writeFileSync(
    `${targetDirRest}/dtos/update.dto.ts`,
    updateInputDtoFileRest(names),
  )
  fs.writeFileSync(
    `${targetDirRest}/dtos/query.dto.ts`,
    queryDtoFileRest(names),
  )

  fs.writeFileSync(
    `${targetDirRest}/entity/${kebab}.entity.ts`,
    createEntityFileRest(names),
  )

  console.log(`

Success.

Your files are ready.
${targetDir}


`)
}
