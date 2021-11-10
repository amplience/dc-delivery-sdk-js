export class NotSupportedError extends Error {
  public readonly name:
    | 'V1_NOT_SUPPORTED'
    | 'V2_NOT_SUPPORTED'
    | 'NOT_SUPPORTED' = 'NOT_SUPPORTED';

  constructor(public property: string, public method: string) {
    super(
      `Not supported. You need to define "${property}" configuration property to use ${method}()`
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class V2NotSupportedError extends NotSupportedError {
  public readonly name = 'V2_NOT_SUPPORTED';

  constructor(public method: string) {
    super('hubName', method);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class V1NotSupportedError extends NotSupportedError {
  public readonly name = 'V1_NOT_SUPPORTED';

  constructor(public method: string) {
    super('account', method);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
