#!/usr/bin/env ts-node

import { Names } from '../util'

// *module.ts
export const createModuleFileRest = (names: Names) => {
  const { capitalPlural, kebabPlural } = names

  const fileContent = `import { Module } from '@nestjs/common'
import { ${capitalPlural}Controller } from './${kebabPlural}.controller'

@Module({
  controllers: [${capitalPlural}Controller],
})
export class ${capitalPlural}Module {}
`
  return fileContent
}

export const createControllerFileRest = (names: Names) => {
  const { capitalPlural, kebab, capital, camel, kebabPlural, camelPlural } =
    names
  const fileContent = `import {
  Controller, Get, Post, Body, Patch, Param, Delete, Query
} from '@nestjs/common'

import { PrismaService } from 'src/common/prisma/prisma.service'
import { ApiTags } from '@nestjs/swagger'
import { Create${capital} } from './dtos/create.dto'
import { ${capital}QueryDto } from './dtos/query.dto'
import { Update${capital} } from './dtos/update.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger'
import { ${capital}Entity } from './entity/${camel}.entity'
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator'
import { GetUserType } from 'src/common/types'
import { checkRowLevelPermission } from 'src/common/auth/util'


@ApiTags('${kebabPlural}')
@Controller('${kebabPlural}')
export class ${capitalPlural}Controller {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ${capital}Entity })
  @Post()
  create(@Body() create${capital}Dto: Create${capital}, @GetUser() user: GetUserType) {
    checkRowLevelPermission(user, create${capital}Dto.uid)
    return this.prisma.${camel}.create({ data: create${capital}Dto })
  }

  @ApiOkResponse({ type: [${capital}Entity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ${capital}QueryDto) {
    return this.prisma.${camel}.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    })
  }

  @ApiOkResponse({ type: ${capital}Entity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.${camel}.findUnique({ where: { id } })
  }

  @ApiOkResponse({ type: ${capital}Entity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() update${capital}Dto: Update${capital},
    @GetUser() user: GetUserType,
  ) {
    const ${camel} = await this.prisma.${camel}.findUnique({ where: { id } })
    checkRowLevelPermission(user, ${camel}.uid)
    return this.prisma.${camel}.update({
      where: { id },
      data: update${capital}Dto,
    })
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  async remove(@Param('id') id: number, @GetUser() user: GetUserType) {
    const ${camel} = await this.prisma.${camel}.findUnique({ where: { id } })
    checkRowLevelPermission(user, ${camel}.uid)
    return this.prisma.${camel}.delete({ where: { id } })
  }
}
`

  return fileContent
}

// *dtos/create-${lower}.input.ts
export const createInputDtoFileRest = (names: Names) => {
  const { kebab, capital } = names
  const fileContent = `import { OmitType } from '@nestjs/swagger'
import { ${capital}Entity } from '../entity/${kebab}.entity'

export class Create${capital} extends OmitType(${capital}Entity, [
  'createdAt',
  'updatedAt',
  'id',
]) {}
`

  return fileContent
}

export const updateInputDtoFileRest = (names: Names) => {
  const { kebab, capital } = names
  const fileContent = `import { PartialType } from '@nestjs/swagger'
import { Create${capital} } from './create.dto'
import { ${capital} } from '@prisma/client'

export class Update${capital} extends PartialType(Create${capital}) {
  id: ${capital}['id']
}

`

  return fileContent
}

export const queryDtoFileRest = (names: Names) => {
  const { capital } = names

  return `import { IsIn, IsOptional } from 'class-validator'
import { Prisma } from '@prisma/client'
import { BaseQueryDto } from 'src/common/dtos/common.dto'

export class ${capital}QueryDto extends BaseQueryDto {
  @IsOptional()
  @IsIn(Object.values(Prisma.${capital}ScalarFieldEnum))
  sortBy?: string
}

`
}

export const createEntityFileRest = (names: Names) => {
  const { capital } = names

  return `import { ${capital} } from '@prisma/client'
import { IsDate, IsString, IsInt } from 'class-validator'
import { RestrictProperties } from 'src/common/dtos/common.input'

export class ${capital}Entity implements RestrictProperties<${capital}Entity, ${capital}> {

}

`
}

export const commonDtosFileRest =
  () => `import { IsIn, IsNumberString, IsOptional } from 'class-validator'

export class BaseQueryDto {
  @IsNumberString()
  @IsOptional()
  skip?: number

  @IsNumberString()
  @IsOptional()
  take?: number

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc'
}

`
