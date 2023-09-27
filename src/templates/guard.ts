import { join } from 'path'

export const authDecorator = `import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { AuthGuard } from 'src/common/guards/auth.guard'
import { Role } from 'src/common/types'

export const AllowAuthenticated = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard))

export const AllowAuthenticatedOptional = (...roles: Role[]) =>
  applyDecorators(
    SetMetadata('allowUnauthenticated', true),
    SetMetadata('roles', roles),
    UseGuards(AuthGuard),
  )

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx)
    const user = context.getContext().req.user
    return user
  },
)
`

export const authGuard = `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { FirebaseService } from 'src/common/firebase/firebase.service'
import { Role } from 'src/common/types'

const authorizeUsingAccesstoken = async (
  accessToken: string,
  firebaseService: FirebaseService,
) => {
  if (!accessToken) {
    return null
  }

  try {
    const data = await firebaseService.getAuth().verifyIdToken(accessToken)

    const userData = await firebaseService
      .getAuth()
      .getUser(data.uid)
      .then((userRecord) => userRecord)

    const { uid, displayName } = userData
    console.log('uid , displayname ', uid, displayName)
    return { uid, displayName, roles: data.roles }
  } catch (error) {
    console.error('AuthMiddleware error: ', error)

    return null
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly firebaseService: FirebaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req

    const bearerHeader = req.headers.authorization
    const accessToken = bearerHeader && bearerHeader.split(' ')[1]

    const user = await authorizeUsingAccesstoken(
      accessToken,
      this.firebaseService,
    )

    const allowUnauthenticated = this.reflector.getAllAndOverride<boolean>(
      'allowUnauthenticated',
      [context.getHandler(), context.getClass()],
    )

    if (!user && !allowUnauthenticated) {
      throw new UnauthorizedException()
    }
    req.user = user

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredRoles.length === 0) {
      return true
    }

    return requiredRoles.some((role) => req.user?.roles?.includes(role))
  }
}
`

export const checkRowLevelPermission = `import { ForbiddenException } from '@nestjs/common'
import { GetUserType, Role } from '../../common/types'

export const checkRowLevelPermission = (
  user: GetUserType,
  requestedUid?: string | string[],
  roles: Role[] = ['admin'],
) => {
  if (!requestedUid) return false

  if (user.roles?.some((role) => roles.includes(role))) {
    return true
  }

  const uids =
    typeof requestedUid === 'string'
      ? [requestedUid]
      : requestedUid.filter(Boolean)

  if (!uids.includes(user.uid)) {
    throw new ForbiddenException()
  }
}
`
