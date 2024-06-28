import { Edition } from './Edition';
import { ContentLifecycle } from './ContentLifecycle';
import { FragmentMeta } from './FragmentMeta';
import { Hierarchy } from './Hierarchy';

export interface IContentMeta {
  /**
   * Metadata related to the edition that published this content item. If the content was not published using
   * an edition this will be undefined.
   */
  edition?: Edition;

  /**
   * Delivery ID of the content item
   */
  deliveryId: string;

  /**
   * Delivery Key of the content item
   */
  deliveryKey?: string;

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
   * Metadata related to hierarchies
   */
  hierarchy?: Hierarchy;
}

/**
 * Children of a hierarchy content item. Each child has a reference to its
 * parent in the hierarchy.
 */
export interface IHierarchyChildContentMeta extends IContentMeta {
  /**
   * Metadata related to hierarchies
   */
  hierarchy: Hierarchy & {
    /**
     * ID of the item's parent in the Hierarchy
     */
    parentId: string;

    /**
     * Always false for Hierarchy Children
     */
    root: false;
  };
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
   * Delivery ID of the content item
   */
  deliveryId: string;

  /**
   * Delivery Key of the content item
   */
  deliveryKey?: string;

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
   * Metadata related to hierarchies
   */
  hierarchy?: Hierarchy;

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

    if (this.deliveryKey) {
      result.deliveryKey = this.deliveryKey;
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

    if (this.hierarchy) {
      result.hierarchy = this.hierarchy;
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
