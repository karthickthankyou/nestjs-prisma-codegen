import {
  authDecorator,
  authGuard,
  checkRowLevelPermission,
} from '../templates/guard'

import { createFolderIfNotPresent, fsWriteFile } from '../util'

export const createAuthFiles = () => {
  const authPath = 'src/common/auth'

  createFolderIfNotPresent(authPath)
  fsWriteFile(`${authPath}/auth.guard.ts`, authGuard)
  fsWriteFile(`${authPath}/auth.decorator.ts`, authDecorator)
  fsWriteFile(`${authPath}/util.ts`, checkRowLevelPermission)
}
