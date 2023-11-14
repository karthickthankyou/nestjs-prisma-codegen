#!/usr/bin/env ts-node

import { createAuthRoutes } from './actions/authRoutes'
import { createCompleteFiles } from './actions/complete'
import { createGraphqlFiles } from './actions/graphql'
import {
  createDecoratorFiles,
  createGuardFiles,
  createTypes,
} from './actions/guard'
import { createPrismaModule } from './actions/prisma'
import { createRestFiles } from './actions/rest'

const [action] = process.argv.slice(2, 3)

switch (action) {
  case '--graphql':
    createPrismaModule()
    createGraphqlFiles()
    break
  case '--rest':
    createPrismaModule()
    createRestFiles()
    break
  case '--complete':
    createPrismaModule()
    createCompleteFiles()
    break
  case '--guard':
    createTypes()
    createGuardFiles()
    createDecoratorFiles()
    break
  case '--auth-routes':
    createTypes()
    createAuthRoutes()
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
