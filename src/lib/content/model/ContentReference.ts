import { FragmentMeta } from './FragmentMeta';
import { ContentReferenceMeta } from './ContentMeta';

/**
 * Required params for creating an content reference
 */
export type RequriedContentReference<T extends {} = {}> = T & {
  id: string;
  contentType?: string;
  _meta?: {
    schema: string;
  };
};

/**
 * Class representing an Content Reference.
 */
export class ContentReference {
  id: string;
  contentType: string;
  _meta: ContentReferenceMeta;

  constructor(data: RequriedContentReference) {
    Object.assign(this, data);

    if (data && data._meta) {
      this._meta = new ContentReferenceMeta(data._meta);
    }

    if (data && data.contentType) {
      this.contentType = data.contentType;
    }
  }

  /**
   * Export ContentReference to JSON
   */
  toJSON(): any {
    const { id } = this;
    const result: RequriedContentReference = {
      id
    };

    if (this._meta) {
      result._meta = this._meta.toJSON();
    }

    if (this.contentType) {
      result.contentType = this.contentType;
    }

    return result;
  }

  /**
   * @hidden
   * Returns true if the provided fragment is an content reference
   * @param fragment
   */
  public static isContentReference(fragment: any): boolean {
    return (
      FragmentMeta.isFragment(fragment) &&
      fragment._meta.schema ===
        'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference'
    );
  }
}
