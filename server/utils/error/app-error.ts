export class AppError extends Error {
  readonly statusCode: number
  readonly code: string
  readonly details?: unknown

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.code = code
    if (details !== undefined) {
      this.details = details
    }
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/** Явно преобразует AppError в H3Error (если не хотите полагаться на error-handler plugin). */
export function appError(error: AppError): never {
  throw createError({
    statusCode: error.statusCode,
    message: error.message,
    data: {
      code: error.code,
      ...(error.details !== undefined ? { details: error.details } : {})
    }
  })
}
