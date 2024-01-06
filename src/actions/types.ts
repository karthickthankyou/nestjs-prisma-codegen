import { prismaModule, prismaService } from '../templates/prisma'
import { types } from '../templates/types'
import { createFolderIfNotPresent, fsWriteFile } from '../util'

export const createTypesFile = () => {
  const typesPath = `src/common/types`
  createFolderIfNotPresent(typesPath)
  fsWriteFile(`${typesPath}/index.ts`, types)
}
