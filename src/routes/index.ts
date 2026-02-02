import { iaRoutes } from '@/app/ia/ia.route.js'
import { authRoutes } from '../app/auth/auth.route.ts.js'
import { usersRoutes } from '../app/users/users.route.js'

export const routes = [
  { routes: authRoutes, prefix: 'auth' },
  { routes: usersRoutes, prefix: 'users' },
  { routes: iaRoutes, prefix: 'ia' },
]
