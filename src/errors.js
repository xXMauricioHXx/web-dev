class CodedError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

class ResourceNotFoundError extends CodedError {
  constructor() {
    super('RESOURCE_NOT_FOUND', 'Resource not found');
  }
}

module.exports = {
  ResourceNotFoundError,
};
