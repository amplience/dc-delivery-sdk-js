import { Media } from './Media';
import { ContentReferenceMeta } from './MediaMeta';
import { ContentClientConfig } from '../ContentClientConfig';
import { FragmentMeta } from '../content/model/FragmentMeta';

export class ContentReference extends Media {
  contentType: string;

  constructor(data: any, config: ContentClientConfig) {
    super(data, config);

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
    const json = super.toJSON();
    const { defaultHost, endpoint, ...result } = json;

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
