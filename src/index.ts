#!/usr/bin/env ts-node

import { createAuthRoutes } from './actions/authRoutes'
import { createCommonFile } from './actions/common'
import { createCompleteFiles } from './actions/complete'
import { createGraphqlFiles } from './actions/graphql'
import { createAuthFiles } from './actions/guard'
import { createPrismaModule } from './actions/prisma'
import { createRestFiles } from './actions/rest'
import { commonDtosFileRest } from './templates/rest'

const [action] = process.argv.slice(2, 3)

switch (action) {
  case '--graphql':
    createCommonFile()
    createGraphqlFiles()
    break
  case '--rest':
    createCommonFile()
    createRestFiles()
    break
  case '--complete':
    createCommonFile()
    createCompleteFiles()
    break

  default:
    console.error(`
    Specify one of
    --graphql Name
    --rest Name
    --complete Name
    --guard
    --auth-routes
    `)
    process.exit(1)
}
