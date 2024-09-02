export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      admin?: boolean
    }
  }
}