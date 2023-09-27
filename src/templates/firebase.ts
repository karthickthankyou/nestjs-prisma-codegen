export const firebaseService = `import { GetUserType, Role } from '../../common/types'
import { Injectable } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App

  constructor(private readonly prisma: PrismaService) {
    const firebasePrivateKey = process.env.firebasePrivateKey.replace(
      /\\n/g,
      '\n',
    )

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.firebaseClientEmail,
        privateKey: firebasePrivateKey,
        projectId: process.env.firebaseProjectId,
      }),
    })
  }

  getAuth = (): admin.auth.Auth => {
    return this.firebaseApp.auth()
  }
}
`

export const firebaseModule = `import { Global, Module } from '@nestjs/common'
import { FirebaseService } from './firebase.service'

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
`
