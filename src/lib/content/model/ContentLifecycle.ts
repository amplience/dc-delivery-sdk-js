/**
 * Class representing the lifecycle status of a Content Item with helper functions.
 */
export class ContentLifecycle {
  /**
   * Date the content should expire in ISO 8601 format.
   * The content will not become unpublished at this time but this value may be used
   * by applications to choose not to show this content.
   */
  expiryTime: string;

  /**
   * Creates a new ContentLifecycle instance.
   * @param data JSON representation of the ContentLifecycle model
   */
  constructor(data?: any) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Returns a boolean to indicate if the content should no longer be displayed by your application.
   * @param currentTime Optional date to override the current time.
   */
  isExpired(currentTime?: Date) {
    currentTime = currentTime || new Date();
    return (
      this.expiryTime !== undefined &&
      new Date(this.expiryTime).getTime() < currentTime.getTime()
    );
  }

  /**
   * Export to JSON
   */
  toJSON(): any {
    return {
      expiryTime: this.expiryTime
    };
  }
}
