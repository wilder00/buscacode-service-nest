const USER = {
  USER_PHONE_EXIST: {
    code: 'USER_PHONE_EXIST',
    message: 'Phone number already exists'
  },
  USER_EMAIL_EXIST: {
    code: 'USER_EMAIL_EXIST',
    message: 'Email already exists'
  }
}

const AUTH = {
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_INVALID_CREDENTIALS',
    message: 'Invalid credentials'
  },
  AUTH_USER_INACTIVE: {
    code: 'AUTH_USER_INACTIVE',
    message: 'User is inactive'
  },
  AUTH_REQUEST_USER_NOT_FOUND: {
    code: 'AUTH_REQUEST_USER_NOT_FOUND',
    message: 'User not found'
  },
  AUTH_TOKEN_REQUIRED: {
    code: 'AUTH_TOKEN_REQUIRED',
    message: 'Token is required'
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_TOKEN_EXPIRED',
    message: 'Token expired'
  },
  AUTH_TOKEN_INVALID: {
    code: 'AUTH_TOKEN_INVALID',
    message: 'Token invalido'
  }
}

export const serviceErrorCodeMap = {
  USER,
  AUTH
}
