import { authRoutes } from '../app/auth/auth.route.ts.js'
import { usersRoutes } from '../app/users/users.route.js'

export const routes = [
  { routes: authRoutes, prefix: 'auth' },
  { routes: usersRoutes },
]
