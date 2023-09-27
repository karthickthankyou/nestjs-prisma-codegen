#!/usr/bin/env ts-node

import { createAuthRoutes } from './actions/authRoutes'
import { createEntityFiles } from './actions/entity'
import {
  createDecoratorFiles,
  createGuardFiles,
  createTypes,
} from './actions/guard'

const [action] = process.argv.slice(2, 3)

if (action === '--entity') {
  createEntityFiles()
} else if (action === '--guard') {
  createTypes()
  createGuardFiles()
  createDecoratorFiles()
} else if (action === '--auth-routes') {
  createAuthRoutes()
} else {
  console.error(`Invalid action type.
    Specify one of
    --entity EntityName
    --guard
    --auth-routes
    `)
  process.exit(1)
}
