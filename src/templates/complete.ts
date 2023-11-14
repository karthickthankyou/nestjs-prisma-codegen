import { Names } from '../util'

export const createCompleteModuleFile = (names: Names) => {
  const { capitalPlural, kebabPlural } = names

  const fileContent = `import { Module } from '@nestjs/common'
import { ${capitalPlural}Service } from './graphql/${kebabPlural}.service'
import { ${capitalPlural}Resolver } from './graphql/${kebabPlural}.resolver'
import { ${capitalPlural}Controller } from './rest/${kebabPlural}.controller'

@Module({
  providers: [${capitalPlural}Resolver, ${capitalPlural}Service],
  exports: [${capitalPlural}Service],
  controllers: [${capitalPlural}Controller],
})
export class ${capitalPlural}Module {}
`
  return fileContent
}
