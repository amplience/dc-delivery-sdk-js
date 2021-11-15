import { Media } from './Media';
import { ImageMeta } from './MediaMeta';
import { FragmentMeta } from '../content/model/FragmentMeta';
import { ImageUrlBuilder } from './ImageUrlBuilder';
import { CommonContentClientConfig } from '../config/CommonContentClientConfig';

/**
 * Class representing an Image resource with helper functions.
 * Image URL helper functions will take into consideration staging and custom hostname overrides.
 */
export class Image extends Media {
  /**
   * Creates a new Image instance.
   * @param data JSON data from delivery API
   * @param config Client configuration
   */
  constructor(data: any, config: CommonContentClientConfig) {
    super(data, config);
    if (data && data._meta) {
      this._meta = new ImageMeta(data._meta);
    }
  }

  /**
   * Returns a builder which can be used to construct a URL to this image resource.
   * You can apply transformations such as resize and image format using the returned builder.
   *
   * ```typescript
   * image.thumbnail().width(500).build();
   * ```
   */
  url(): ImageUrlBuilder {
    return new ImageUrlBuilder(this);
  }
  /**
   * Export Image to JSON
   */
  toJSON(): any {
    const result = super.toJSON();
    if (this._meta) {
      result._meta = this._meta.toJSON();
    }
    return result;
  }

  /**
   * @hidden
   * Returns true if the provided fragment is an image
   * @param fragment
   */
  public static isImage(fragment: any): boolean {
    return (
      FragmentMeta.isFragment(fragment) &&
      fragment._meta.schema ===
        'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
    );
  }
}
