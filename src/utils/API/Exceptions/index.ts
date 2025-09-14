export class Unauthorized extends Error {
  constructor(message = 'User unauthorized!') {
    super(message);
  }
}

export class BadRequest extends Error {
  constructor(message = 'Bad request!') {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(message = 'Validation error!') {
    super(message);
  }
}
