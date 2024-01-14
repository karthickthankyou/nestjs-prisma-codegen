import { join } from 'path'

export const authDecorator = `import {
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'
import { Role } from 'src/common/types'

import { AuthGuard } from './auth.guard'
import { GqlExecutionContext } from '@nestjs/graphql'

export const AllowAuthenticated = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard))

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const context = GqlExecutionContext.create(ctx)
  return context.getContext().req.user
})
`

export const authGuard = `import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { Role } from 'src/common/types'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req

    await this.authenticateUser(req)

    return this.authorizeUser(req, context)
  }

  private async authenticateUser(req: any): Promise<void> {
    const bearerHeader = req.headers.authorization
    // Bearer eylskfdjlsdf309
    const token = bearerHeader?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('No token provided.')
    }

    try {
      const user = await this.jwtService.verify(token)
      req.user = user
    } catch (err) {
      console.error('Token validation error:', err)
    }

    if (!req.user) {
      throw new UnauthorizedException('Invalid token.')
    }
  }

  private async authorizeUser(
    req: any,
    context: ExecutionContext,
  ): Promise<boolean> {
    const userRoles = await this.getUserRoles(req.user.uid)
    req.user.roles = userRoles

    const requiredRoles = this.getMetadata<Role[]>('roles', context)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    return requiredRoles.some((role) => userRoles.includes(role))
  }

  private getMetadata<T>(key: string, context: ExecutionContext): T {
    return this.reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ])
  }

  private async getUserRoles(uid: string): Promise<Role[]> {
    const rolePromises = [
      this.prisma.admin.findUnique({ where: { uid } }),
      // Add promises for other role models here
    ]

    const roles: Role[] = []

    const [admin] = await Promise.all(rolePromises)
    admin && roles.push('admin')

    return roles
  }
}
`

export const checkRowLevelPermission = `import { GetUserType, Role } from 'src/common/types'
import { ForbiddenException } from '@nestjs/common'

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
