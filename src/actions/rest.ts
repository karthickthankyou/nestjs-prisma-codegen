import { join } from 'path'
const fs = require('fs')
import {
  createCommonDtosFileRest,
  createComponentNames,
  createFolderIfNotPresent,
} from '../util'
import {
  createEntityFileRest,
  createInputDtoFileRest,
  createModuleFileRest,
  createControllerFileRest,
  updateInputDtoFileRest,
  queryDtoFileRest,
} from '../templates/rest'

export const createRestFiles = () => {
  const [componentName] = process.argv.slice(3, 4)
  console.log('Generating files...', componentName)

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

  fs.mkdirSync(`${process.cwd()}/src/models/${kebabPlural}`)
  fs.mkdirSync(`${process.cwd()}/src/models/${kebabPlural}/dtos`)
  fs.mkdirSync(`${process.cwd()}/src/models/${kebabPlural}/entity`)

  fs.writeFileSync(
    `${targetDir}/${kebabPlural}.module.ts`,
    createModuleFileRest(names),
  )
  fs.writeFileSync(
    `${targetDir}/${kebabPlural}.controller.ts`,
    createControllerFileRest(names),
  )

  fs.writeFileSync(
    `${targetDir}/dtos/create.dto.ts`,
    createInputDtoFileRest(names),
  )
  fs.writeFileSync(
    `${targetDir}/dtos/update.dto.ts`,
    updateInputDtoFileRest(names),
  )
  fs.writeFileSync(`${targetDir}/dtos/query.dto.ts`, queryDtoFileRest(names))

  fs.writeFileSync(
    `${targetDir}/entity/${kebab}.entity.ts`,
    createEntityFileRest(names),
  )
  console.log(`

Success.

Your files are ready.
${targetDir}


`)
}
