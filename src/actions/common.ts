import { createAuthFiles } from './guard'
import { createPrismaModule } from './prisma'
import { createTypesFile } from './types'

export const createCommonFile = () => {
  createAuthFiles()
  createPrismaModule()
  createTypesFile()
}
