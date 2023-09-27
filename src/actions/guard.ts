import {
  authDecorator,
  authGuard,
  checkRowLevelPermission,
} from '../templates/guard'
import { types } from '../templates/types'
import { createFolderIfNotPresent, fsWriteFile } from '../util'

export const createTypes = () => {
  const typesPath = `src/common/types`
  createFolderIfNotPresent(typesPath)
  fsWriteFile(`${typesPath}/index.ts`, types)
}

export const createGuardFiles = () => {
  const guardsPath = 'src/common/guards'

  createFolderIfNotPresent(guardsPath)
  fsWriteFile(`${guardsPath}/auth.guard.ts`, authGuard)
  fsWriteFile(`${guardsPath}/util.ts`, checkRowLevelPermission)
}

export const createDecoratorFiles = () => {
  const decoratorsPath = 'src/common/decorators'

  createFolderIfNotPresent(decoratorsPath)
  fsWriteFile(`${decoratorsPath}/auth.decorator.ts`, authDecorator)
}
