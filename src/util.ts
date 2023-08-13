// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require('pluralize')
import * as changeCase from 'change-case'
import path = require('path')
import * as fs from 'fs'

export const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

export type Names = {
  capital: string
  capitalPlural: string
  kebab: string
  kebabPlural: string
  camel: string
  camelPlural: string
}

export const createComponentNames = (name: string) => {
  const capital = changeCase.capitalCase(name).split(' ').join('')
  const camel = changeCase.camelCase(name)
  const kebab = changeCase.paramCase(name)

  const names: Names = {
    capital,
    capitalPlural: pluralize(capital),
    kebab,
    kebabPlural: pluralize(kebab),
    camel,
    camelPlural: pluralize(camel),
  }

  return names
}

export const createCommonDtosFile = () => {
  const commonDtoPath = path.join(
    process.cwd(),
    'src/models/common/dtos/common.input.ts',
  )
  const commonDtoTemplatePath = path.join(
    __dirname,
    './templates/common.input.ts',
  )

  // Check if the common DTO file already exists
  if (!fs.existsSync(commonDtoPath)) {
    // Read the common DTO template
    const commonDtoContent = fs.readFileSync(commonDtoTemplatePath, 'utf8')

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(commonDtoPath), { recursive: true })

    // Write the common DTO file to the target directory
    fs.writeFileSync(commonDtoPath, commonDtoContent)

    console.log('Common DTO file has been copied.')
  } else {
    console.log('Common DTO file already exists.')
  }
}
