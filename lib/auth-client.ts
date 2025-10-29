// core
import { createAuthClient } from "better-auth/react"

// plugins
import { usernameClient, adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    adminClient()
  ]
})
