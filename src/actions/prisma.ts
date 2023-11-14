import { prismaModule, prismaService } from '../templates/prisma'
import { createFolderIfNotPresent, fsWriteFile } from '../util'

export const createPrismaModule = () => {
  const prismaPath = `src/common/prisma`
  createFolderIfNotPresent(prismaPath)
  fsWriteFile(`${prismaPath}/prisma.module.ts`, prismaModule)
  fsWriteFile(`${prismaPath}/prisma.service.ts`, prismaService)
}
