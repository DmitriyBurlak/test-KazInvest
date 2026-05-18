import { AppError } from './app-error'

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, code: string = 'AUTHENTICATION_ERROR') {
    super(message, 401, code)
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor(message: string = 'Invalid email or password') {
    super(message, 'INVALID_CREDENTIALS')
  }
}

export class InvalidSessionError extends AuthenticationError {
  constructor(message: string = 'Invalid session') {
    super(message, 'INVALID_SESSION')
  }
}

export class EmailNotVerifiedError extends AuthenticationError {
  constructor(message: string = 'Email не подтверждён. Проверьте вашу почту') {
    super(message, 'EMAIL_NOT_VERIFIED')
  }
}

export class SessionExpiredError extends AuthenticationError {
  constructor(message: string = 'Session expired. Please login again') {
    super(message, 'SESSION_EXPIRED')
  }
}

export class AccessTokenExpiredError extends AuthenticationError {
  constructor(message: string = 'Access token expired. Please refresh') {
    super(message, 'ACCESS_TOKEN_EXPIRED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT')
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Слишком много запросов. Попробуйте позже') {
    super(message, 429, 'RATE_LIMIT')
  }
}

export class DependencyError extends AppError {
  constructor(message: string = 'Failed Dependency', code: string = 'FAILED_DEPENDENCY') {
    super(message, 424, code)
  }
}

export class EmailSendError extends DependencyError {
  constructor(message: string = 'Ошибка отправки письма') {
    super(message, 'EMAIL_SEND_FAILED')
  }
}

export class UpstreamError extends AppError {
  constructor(message: string, code: string = 'UPSTREAM_ERROR', details?: unknown) {
    super(message, 502, code, details)
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR')
  }
}
