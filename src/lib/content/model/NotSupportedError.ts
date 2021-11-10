export class NotSupportedError extends Error {
  public readonly name = 'V2_NOT_SUPPORTED';

  constructor(public property: string, public method: string) {
    super(
      `Not supported. You need to define "${property}" configuration property to use ${method}()`
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function v1NotSupportedError(method: string): NotSupportedError {
  return new NotSupportedError('account', method);
}

export function v2NotSupportedError(method: string): NotSupportedError {
  return new NotSupportedError('hubName', method);
}
