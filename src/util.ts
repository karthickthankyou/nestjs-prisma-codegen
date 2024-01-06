// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluralize = require('pluralize')
import * as changeCase from 'change-case'
import path = require('path')
import * as fs from 'fs'

import { commonDtosFile } from './templates/graphql'
import { commonDtosFileRest } from './templates/rest'

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
  const commonDtoFolder = 'src/common/dtos'
  createFolderIfNotPresent(commonDtoFolder)

  const commonDtoPath = commonDtoFolder + '/common.input.ts'
  const commonDto = path.join(process.cwd(), commonDtoPath)

  // Check if the common DTO file already exists
  if (!fs.existsSync(commonDto)) {
    fs.writeFileSync(commonDto, commonDtosFile())

    console.log('Common DTO file has been copied.')
  } else {
    console.log('Common DTO file already exists.')
  }
}

export const createCommonDtosFileRest = () => {
  const commonDtoFolder = 'src/common/dtos'
  createFolderIfNotPresent(commonDtoFolder)

  const commonDtoPath = commonDtoFolder + '/common.dto.ts'
  const commonDto = path.join(process.cwd(), commonDtoPath)

  // Check if the common DTO file already exists
  if (!fs.existsSync(commonDto)) {
    fs.writeFileSync(commonDto, commonDtosFileRest())

    console.log('Common DTO file has been copied.')
  } else {
    console.log('Common DTO file already exists.')
  }
}

export const createFolderIfNotPresent = (folderName: string) => {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true })
    console.log(`
📂 Folder ${folderName} has been created.`)
  }
}

export const fsWriteFile = (path: string, fileContent: string) => {
  if (fs.existsSync(path)) {
    return
  }

  fs.writeFileSync(path, fileContent)
  console.log(`📃 File created at ${path}`)
}
