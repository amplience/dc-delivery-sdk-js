function dataToMessage(data: any): string {
  if (typeof data === 'string') {
    return data;
  } else if (data.error && data.error.message) {
    return data.error.message;
  } else {
    return JSON.stringify(data);
  }
}

export class HttpError extends Error {
  public readonly name = 'HTTP_ERROR';

  constructor(
    public status: number,
    public data: Record<string, any> | string,
    message?: string
  ) {
    super(message || dataToMessage(data));
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
