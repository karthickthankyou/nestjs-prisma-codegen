export const types = `
export type Role = 'admin'

export type GetUserType = {
  uid: string
  displayName: string
  email: string
  emailVerified: boolean
  phoneNumber: string
  roles: Role[]
}
`
