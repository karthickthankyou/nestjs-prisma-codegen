import {
  authInputDto,
  authModule,
  authResolver,
  authService,
} from '../templates/authRoutes'

import { createFolderIfNotPresent, fsWriteFile } from '../util'

export const createAuthRoutes = () => {
  const routesPath = 'src/models/auth'
  const routesDtoPath = 'src/models/auth/dto'

  const firebaseModulePath = 'src/common/firebase'

  createFolderIfNotPresent(routesPath)

  fsWriteFile(`${routesPath}/auth.module.ts`, authModule)
  fsWriteFile(`${routesPath}/auth.resolver.ts`, authResolver)
  fsWriteFile(`${routesPath}/auth.service.ts`, authService)

  createFolderIfNotPresent(routesDtoPath)
  fsWriteFile(`${routesDtoPath}/auth.input.ts`, authInputDto)

  createFolderIfNotPresent(firebaseModulePath)
}
