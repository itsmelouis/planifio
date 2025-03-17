declare module '#auth-utils' {
  interface User {
    provider?: string
    id?: string
    email?: string
    name?: string
    avatar?: string   
  }

  interface UserSession {
    githubId?: string
    email?: string
    name?: string
    avatar?: string
  }
}

export {}
