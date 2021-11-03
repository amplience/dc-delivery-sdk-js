import { ContentBody, DefaultContentBody } from './ContentBody';

/**
 * Class representing Content returned from the Content Delivery Service.
 * The body property will contain the properties specified by the JSON schema content type.
 * Any linked content items will be included inline in the body.
 */
export class ContentItem<T extends ContentBody = DefaultContentBody> {
  /**
   * Body of the content item. This object will contain the properties specified by the JSON schema content type.
   * Any linked content items will be included inline in the body.
   */
  body: T;

  /**
   * Returns a plain JSON version of the content body, removing helper properties and functions.
   * This should be used if your application needs to serialize the content body, e.g. in an API response.
   */
  toJSON(): any {
    return JSON.parse(JSON.stringify(this.body));
  }
}
