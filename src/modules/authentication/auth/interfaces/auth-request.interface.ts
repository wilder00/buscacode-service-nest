import { User } from '@/src/modules/authorization/user/entities/user.entity'
import { Request } from 'express'

export interface AuthRequest extends Request {
  user: User
}
