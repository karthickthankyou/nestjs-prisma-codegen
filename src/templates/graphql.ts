#!/usr/bin/env ts-node

import { Names } from '../util'

// *module.ts
export const createModuleFile = (names: Names) => {
  const { capitalPlural, kebabPlural } = names

  const fileContent = `import { Module } from '@nestjs/common'
import { ${capitalPlural}Service } from './${kebabPlural}.service'
import { ${capitalPlural}Resolver } from './${kebabPlural}.resolver'

@Module({
  providers: [${capitalPlural}Resolver, ${capitalPlural}Service],
  exports: [${capitalPlural}Service],
})
export class ${capitalPlural}Module {}
`
  return fileContent
}

export const createResolverFile = (names: Names) => {
  const { capitalPlural, kebab, capital, camel, kebabPlural, camelPlural } =
    names
  const fileContent = `import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { ${capitalPlural}Service } from './${kebabPlural}.service'
import { ${capital} } from './entity/${kebab}.entity'
import { FindMany${capital}Args, FindUnique${capital}Args } from './dtos/find.args'
import { Create${capital}Input } from './dtos/create-${kebab}.input'
import { Update${capital}Input } from './dtos/update-${kebab}.input'
import { checkRowLevelPermission } from 'src/common/auth/util'
import { GetUserType } from 'src/common/types'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Resolver(() => ${capital})
export class ${capitalPlural}Resolver {
  constructor(private readonly ${camelPlural}Service: ${capitalPlural}Service,
    private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @Mutation(() => ${capital})
  create${capital}(@Args('create${capital}Input') args: Create${capital}Input, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, args.uid)
    return this.${camelPlural}Service.create(args)
  }

  @Query(() => [${capital}], { name: '${camelPlural}' })
  findAll(@Args() args: FindMany${capital}Args) {
    return this.${camelPlural}Service.findAll(args)
  }

  @Query(() => ${capital}, { name: '${camel}' })
  findOne(@Args() args: FindUnique${capital}Args) {
    return this.${camelPlural}Service.findOne(args)
  }

  @AllowAuthenticated()
  @Mutation(() => ${capital})
  async update${capital}(@Args('update${capital}Input') args: Update${capital}Input, @GetUser() user: GetUserType) {
    const ${camel} = await this.prisma.${camel}.findUnique({ where: { id: args.id } })
    checkRowLevelPermission(user, ${camel}.uid)
    return this.${camelPlural}Service.update(args)
  }

  @AllowAuthenticated()
  @Mutation(() => ${capital})
  async remove${capital}(@Args() args: FindUnique${capital}Args, @GetUser() user: GetUserType) {
    const ${camel} = await this.prisma.${camel}.findUnique(args)
    checkRowLevelPermission(user, ${camel}.uid)
    return this.${camelPlural}Service.remove(args)
  }
}
`

  return fileContent
}

export const createServiceFile = (names: Names) => {
  const { capitalPlural, capital, kebab, camel } = names
  const fileContent = `import { Injectable } from '@nestjs/common'
import { FindMany${capital}Args, FindUnique${capital}Args } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { Create${capital}Input } from './dtos/create-${kebab}.input'
import { Update${capital}Input } from './dtos/update-${kebab}.input'

@Injectable()
export class ${capitalPlural}Service {
  constructor(private readonly prisma: PrismaService) {}
  create(create${capital}Input: Create${capital}Input) {
    return this.prisma.${camel}.create({
      data: create${capital}Input,
    })
  }

  findAll(args: FindMany${capital}Args) {
    return this.prisma.${camel}.findMany(args)
  }

  findOne(args: FindUnique${capital}Args) {
    return this.prisma.${camel}.findUnique(args)
  }

  update(update${capital}Input: Update${capital}Input) {
    const { id, ...data } = update${capital}Input
    return this.prisma.${camel}.update({
      where: { id },
      data: data,
    })
  }

  remove(args: FindUnique${capital}Args) {
    return this.prisma.${camel}.delete(args)
  }
}
`
  return fileContent
}

// *dtos/create-${lower}.input.ts
export const createInputDtoFile = (names: Names) => {
  const { kebab, capital } = names
  const fileContent = `import { InputType, PickType } from '@nestjs/graphql'
import { ${capital} } from '../entity/${kebab}.entity'

@InputType()
export class Create${capital}Input extends PickType(${capital},[],InputType) {}

`

  return fileContent
}

export const updateInputDtoFile = (names: Names) => {
  const { kebab, capital } = names
  const fileContent = `import { Create${capital}Input } from './create-${kebab}.input'
import { InputType, PartialType } from '@nestjs/graphql'
import { ${capital} } from '@prisma/client'

@InputType()
export class Update${capital}Input extends PartialType(Create${capital}Input) {
  id: ${capital}['id']
}
`

  return fileContent
}

export const findInputDtoFile = (names: Names) => {
  const { capital } = names

  return `import { ArgsType, Field, registerEnumType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { ${capital}OrderByWithRelationInput } from './order-by.args'
import { ${capital}WhereInput, ${capital}WhereUniqueInput } from './where.args'
import { RestrictProperties } from 'src/common/dtos/common.input'

registerEnumType(Prisma.${capital}ScalarFieldEnum, {
  name: '${capital}ScalarFieldEnum',
})

@ArgsType()
class FindMany${capital}ArgsStrict
  implements RestrictProperties<FindMany${capital}ArgsStrict, Omit<Prisma.${capital}FindManyArgs, 'include' | 'select'>>
{
  where: ${capital}WhereInput
  orderBy: ${capital}OrderByWithRelationInput[]
  cursor: ${capital}WhereUniqueInput
  take: number
  skip: number
  @Field(() => [Prisma.${capital}ScalarFieldEnum])
  distinct: Prisma.${capital}ScalarFieldEnum[]
}

@ArgsType()
export class FindMany${capital}Args extends PartialType(
  FindMany${capital}ArgsStrict,
) {}

@ArgsType()
export class FindUnique${capital}Args {
  where: ${capital}WhereUniqueInput
}`
}

export const orderByInputDtoFile = (names: Names) => {
  const { capital } = names

  return `import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@InputType()
export class ${capital}OrderByWithRelationInputStrict
  implements RestrictProperties<${capital}OrderByWithRelationInputStrict, Prisma.${capital}OrderByWithRelationInput>
{
  // Todo: Add below field decorator to the SortOrder properties.
  // @Field(() => Prisma.SortOrder)
}


@InputType()
export class ${capital}OrderByWithRelationInput extends PartialType(
  ${capital}OrderByWithRelationInputStrict,
) {}

@InputType()
export class ${capital}OrderByRelationAggregateInput {
  @Field(() => Prisma.SortOrder)
  _count?: Prisma.SortOrder
}
`
}
export const whereInputDtoFile = (names: Names) => {
  const { capital } = names

  return `import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Prisma } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@InputType()
export class ${capital}WhereUniqueInput {
  id: number
}

@InputType()
export class ${capital}WhereInputStrict implements RestrictProperties<${capital}WhereInputStrict, Prisma.${capital}WhereInput> {
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  AND: ${capital}WhereInput[]
  OR: ${capital}WhereInput[]
  NOT: ${capital}WhereInput[]
}

@InputType()
export class ${capital}WhereInput extends PartialType(
  ${capital}WhereInputStrict,
) {}

@InputType()
export class ${capital}ListRelationFilter {
  every?: ${capital}WhereInput
  some?: ${capital}WhereInput
  none?: ${capital}WhereInput
}

@InputType()
export class ${capital}RelationFilter {
  is?: ${capital}WhereInput
  isNot?: ${capital}WhereInput
}
`
}

export const createEntityFile = (names: Names) => {
  const { capital } = names

  return `import { ObjectType } from '@nestjs/graphql'
import { ${capital} as ${capital}Type } from '@prisma/client'
import { RestrictProperties } from 'src/common/dtos/common.input'

@ObjectType()
export class ${capital} implements RestrictProperties<${capital},${capital}Type> {
    // Todo Add below to make optional fields optional.
    // @Field({ nullable: true })
}
`
}

export const commonDtosFile = () => `import {
  ArgsType,
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { Prisma } from '@prisma/client'

export type RestrictProperties<T, U> = {
  [K in keyof T]: K extends keyof U ? T[K] : never
} & Required<U>

// implements Prisma.DateTimeFilter
@InputType()
export class DateTimeFilter {
  equals?: string
  in?: string[]
  notIn?: string[]
  lt?: string
  lte?: string
  gt?: string
  gte?: string
}

registerEnumType(Prisma.QueryMode, {
  name: 'QueryMode',
})

// implements Required<Prisma.StringFilter>
@InputType()
export class StringFilter {
  equals?: string
  in?: string[]
  notIn?: string[]
  lt?: string
  lte?: string
  gt?: string
  gte?: string
  contains?: string
  startsWith?: string
  endsWith?: string
  not?: string
  @Field(() => Prisma.QueryMode)
  mode?: Prisma.QueryMode
}
@InputType()
export class StringListFilter {
  equals?: string[]
  has?: string
  hasEvery?: string[]
  hasSome?: string[]
  isEmpty?: boolean
}

@InputType()
export class BoolFilter {
  equals?: boolean
  not?: boolean
}

// implements Required<Prisma.IntFilter>
@InputType()
export class IntFilter {
  equals?: number
  lt?: number
  lte?: number
  gt?: number
  gte?: number
}


@InputType()
export class FloatFilter {
  equals?: number
  lt?: number
  lte?: number
  gt?: number
  gte?: number
  not?: number
}

registerEnumType(Prisma.SortOrder, {
  name: 'SortOrder',
})

@ObjectType()
export class AggregateCountOutput {
  count: number
}

@InputType()
export class LocationFilterInput {
  @Field(() => Float)
  ne_lat: number

  @Field(() => Float)
  ne_lng: number

  @Field(() => Float)
  sw_lat: number

  @Field(() => Float)
  sw_lng: number
}

@ArgsType()
export class PaginationInput {
  take?: number
  skip?: number
}
`
