import { join } from 'path'
const fs = require('fs')
import {
  createCommonDtosFile,
  createComponentNames,
  createFolderIfNotPresent,
} from '../util'
import {
  createEntityFile,
  createInputDtoFile,
  createModuleFile,
  createResolverFile,
  createServiceFile,
  findInputDtoFile,
  orderByInputDtoFile,
  updateInputDtoFile,
  whereInputDtoFile,
} from '../templates/graphql'

export const createGraphqlFiles = () => {
  const [componentName] = process.argv.slice(3, 4)
  console.log('Generating files...', componentName)

  createCommonDtosFile()

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
    createModuleFile(names),
  )
  fs.writeFileSync(
    `${targetDir}/${kebabPlural}.resolver.ts`,
    createResolverFile(names),
  )
  fs.writeFileSync(
    `${targetDir}/${kebabPlural}.service.ts`,
    createServiceFile(names),
  )
  fs.writeFileSync(
    `${targetDir}/dtos/create-${kebab}.input.ts`,
    createInputDtoFile(names),
  )
  fs.writeFileSync(
    `${targetDir}/dtos/update-${kebab}.input.ts`,
    updateInputDtoFile(names),
  )
  fs.writeFileSync(`${targetDir}/dtos/find.args.ts`, findInputDtoFile(names))
  fs.writeFileSync(
    `${targetDir}/dtos/order-by.args.ts`,
    orderByInputDtoFile(names),
  )
  fs.writeFileSync(`${targetDir}/dtos/where.args.ts`, whereInputDtoFile(names))
  fs.writeFileSync(
    `${targetDir}/entity/${kebab}.entity.ts`,
    createEntityFile(names),
  )
  console.log(`

Success.

Your files are ready.
${targetDir}


`)
}
