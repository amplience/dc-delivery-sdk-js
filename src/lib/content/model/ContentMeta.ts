import { Edition } from './Edition';
import { ContentLifecycle } from './ContentLifecycle';
import { FragmentMeta } from './FragmentMeta';

/**
 * Class providing meta data about an Content Reference resource.
 */
export class ContentReferenceMeta extends FragmentMeta {
  constructor(data?: any) {
    super(data);
  }
}

/**
 * Class providing meta data about a content item with helper functions.
 */
export class ContentMeta extends FragmentMeta {
  /**
   * Metadata related to the edition that published this content item. If the content was not published using
   * an edition this will be undefined.
   */
  edition?: Edition;

  /**
   * Delivery id of the content item
   */
  deliveryId: string;

  /**
   * Metadata related to the lifecycle status of this content item, by default this is undefined.
   * Business users can flag content to expire at a certain time. If this option is chosen this property
   * will be set with the chosen expiry time.
   */
  lifecycle?: ContentLifecycle;

  /**
   * Name of the content item
   */
  name: string;

  /**
   * Creates a new ContentMeta instance.
   * @param data JSON representation of the ContentMeta model
   */
  constructor(data?: any) {
    super(data);

    if (data) {
      if (data.edition) {
        this.edition = new Edition(data.edition);
      }

      if (data.lifecycle) {
        this.lifecycle = new ContentLifecycle(data.lifecycle);
      }
    }
  }

  /**
   * Export to JSON
   */
  toJSON(): any {
    const result = super.toJSON();

    if (this.deliveryId) {
      result.deliveryId = this.deliveryId;
    }

    if (this.name) {
      result.name = this.name;
    }

    if (this.edition) {
      result.edition = this.edition.toJSON();
    }

    if (this.lifecycle) {
      result.lifecycle = this.lifecycle.toJSON();
    }

    return result;
  }

  /**
   * @hidden
   * Returns true if the provided node is a content item meta data object
   * @param node JSON node to test
   */
  public static isContentMeta(node: any): boolean {
    return (
      node != null &&
      node.schema != null &&
      (node.name != null || node.deliveryId != null)
    );
  }

  /**
   * @hidden
   * Returns true if the provided node is a content body object
   * @param node JSON node to test
   */
  public static isContentBody(node: any): boolean {
    return node != null && this.isContentMeta(node._meta);
  }
}
