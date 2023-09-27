export const authInputDto = `import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
  @Field()
  email: string
  @Field()
  password: string
}

@ObjectType()
export class LoginOutput {
  @Field()
  kind: string
  @Field()
  localId: string
  @Field()
  email: string
  @Field()
  displayName: string
  @Field()
  idToken: string
  @Field()
  refreshToken: string
  @Field()
  expiresIn: string
}

@InputType()
export class RegisterInput {
  @Field()
  email: string
  @Field()
  password: string
  @Field()
  displayName?: string
}

@ObjectType()
export class RegisterOutput extends LoginOutput {}

@InputType()
export class RefreshTokenInput {
  @Field()
  refresh_token: string
}

@ObjectType()
export class RefreshTokenOutput {
  @Field()
  access_token: string
  @Field()
  expires_in: string
  @Field()
  token_type: string
  @Field()
  refresh_token: string
  @Field()
  id_token: string
  @Field()
  user_id: string
  @Field()
  project_id: string
}
`

export const authModule = `import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'

@Module({
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
`

export const authResolver = `import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import {
  LoginInput,
  LoginOutput,
  RefreshTokenInput,
  RefreshTokenOutput,
  RegisterInput,
  RegisterOutput,
} from './dto/auth.input'

@Resolver(() => LoginOutput)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginOutput)
  async login(@Args('credentials') args: LoginInput) {
    return this.authService.login(args)
  }

  @Mutation(() => RegisterOutput)
  async register(@Args('credentials') args: RegisterInput) {
    const user = await this.authService.register(args)
    return user
  }

  @Mutation(() => RefreshTokenOutput)
  refreshToken(@Args('refreshTokenInput') args: RefreshTokenInput) {
    return this.authService.refreshToken(args)
  }
}
`

export const authService = `import { BadRequestException, Injectable } from '@nestjs/common'
import { FirebaseService } from 'src/common/firebase/firebase.service'
import {
  LoginInput,
  LoginOutput,
  RefreshTokenInput,
  RefreshTokenOutput,
  RegisterInput,
  RegisterOutput,
} from './dto/auth.input'
import axios from 'axios'
import * as admin from 'firebase-admin'
import { GetUserType, Role } from 'src/common/types'

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async login(args: LoginInput) {
    const { email, password } = args
    console.log('axios.post: ', axios.post)
    try {
      const firebaseUser = await axios.post<LoginOutput>(
        \`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.firebaseAPIKey}\`,
        { email, password, returnSecureToken: true },
      )

      return firebaseUser.data
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  async refreshToken(args: RefreshTokenInput) {
    const { refresh_token } = args
    try {
      const firebaseUser = await axios.post<RefreshTokenOutput>(
        \`https://securetoken.googleapis.com/v1/token?key=${process.env.firebaseAPIKey}\`,
        { grant_type: 'refresh_token', refresh_token, returnSecureToken: true },
      )
      console.log('Refresh token Data ', firebaseUser)
      return firebaseUser.data
    } catch (err) {
      throw new BadRequestException(err.response.data.error.message)
    }
  }

  async register(args: RegisterInput): Promise<RegisterOutput> {
    const { email, password, displayName } = args

    try {
      const firebaseUser = await axios.post<RegisterOutput>(
        \`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.firebaseAPIKey}\`,
        { email, password, displayName, returnSecureToken: true },
      )

      return firebaseUser.data
    } catch (err) {
      console.error('Registration error:', err)
      throw new BadRequestException('Registration failed.')
    }
  }

  async setRole(user: GetUserType, role: Role): Promise<boolean> {
    const existingRoles = user.roles || []
    if (existingRoles.includes(role)) {
      console.error(\`User already has this role. \${role}\`)
      return false
    }

    const updatedRoles = [...existingRoles, role]

    await this.firebaseService
      .getAuth()
      .setCustomUserClaims(user.uid, {
        roles: updatedRoles,
      })
      .then((res) => {
        console.log(\`Successfully set \${JSON.stringify(res)}\`)
      })

    return true
  }
}
`
