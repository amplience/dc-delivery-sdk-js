/**
 * @hidden
 */
export class NotSupportedError extends Error {
  public readonly name:
    | 'NOT_SUPPORTED_V1'
    | 'NOT_SUPPORTED_V2'
    | 'NOT_SUPPORTED' = 'NOT_SUPPORTED';

  constructor(public property: string, public method: string) {
    super(
      `Not supported. You need to define "${property}" configuration property to use ${method}()`
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotSupportedV1Error extends NotSupportedError {
  public readonly name = 'NOT_SUPPORTED_V1';

  constructor(public method: string) {
    super('account', method);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class NotSupportedV2Error extends NotSupportedError {
  public readonly name = 'NOT_SUPPORTED_V2';

  constructor(public method: string) {
    super('hubName', method);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
