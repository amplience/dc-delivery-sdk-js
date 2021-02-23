export class ContentNotFoundError extends Error {
  public readonly name = 'CONTENT_NOT_FOUND';

  constructor(public contentItem: string) {
    super(`Content item "${contentItem}" was not found`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
