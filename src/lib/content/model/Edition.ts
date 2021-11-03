/**
 * Class representing the Edition resource with helper functions.
 * An Edition is the main way of scheduling content to be published on a specific date.
 */
export class Edition {
  /**
   * Unique id of the Edition
   */
  id: string;

  /**
   * Date when the edition should begin in ISO 8601 format
   */
  start: string;

  /**
   * Date when the edition should end in ISO 8601 format
   */
  end: string;

  /**
   * Creates a new Edition instance.
   * @param data JSON representation of the Edition model
   */
  constructor(data?: Record<string, any>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * Date when the edition should begin
   */
  getStartDate(): Date {
    return new Date(this.start);
  }

  /**
   * Date when the edition should end
   */
  getEndDate(): Date {
    return new Date(this.end);
  }

  /**
   * Export to JSON
   */
  toJSON(): any {
    return {
      id: this.id,
      start: this.start,
      end: this.end,
    };
  }
}
