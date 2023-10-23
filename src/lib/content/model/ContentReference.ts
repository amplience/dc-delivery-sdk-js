import { FragmentMeta } from './FragmentMeta';
/**
 * Required params for creating an content reference
 */
export type RequiredContentReference<
  T extends Record<string, unknown> = Record<string, unknown>
> = T & {
  id: string;
  contentType?: string;
  _meta?: {
    schema: string;
  };
};

/**
 * Class providing meta data about an Content Reference resource.
 * @deprecated use FragmentMeta
 */
export class ContentReferenceMeta extends FragmentMeta {
  constructor(data?: any) {
    super(data);
  }
}

/**
 * Class representing an Content Reference.
 */
export class ContentReference {
  id: string;
  contentType: string;
  _meta: ContentReferenceMeta;

  constructor(data: RequiredContentReference) {
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
    const result: RequiredContentReference = {
      id,
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
  public static isContentReference(
    fragment: RequiredContentReference<Record<string, unknown>>
  ): boolean {
    return (
      FragmentMeta.isFragment(fragment) &&
      fragment._meta.schema ===
        'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference'
    );
  }
}
