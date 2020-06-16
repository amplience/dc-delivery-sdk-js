import { Media } from './Media';
import { FragmentMeta } from '../content/model/FragmentMeta';
import { ImageUrlBuilder } from './ImageUrlBuilder';
import { CommonContentClientConfig } from '../config/CommonContentClientConfig';
import { VideoMeta } from './MediaMeta';

/**
 * Class representing a Video resource with helper functions.s
 */
export class Video extends Media {
  /**
   * Metadata about the Video
   */
  _meta: VideoMeta;

  /**
   * Creates a new Video instance.
   * @param data JSON data from delivery API
   */
  constructor(data: any, config: CommonContentClientConfig) {
    super(data, config);
    if (data && data._meta) {
      this._meta = new VideoMeta(data._meta);
    }
  }

  /**
   * Returns a builder which can be used to construct a video thumbnail URL.
   * You can apply transformations such as resize and image format using the returned builder.
   *
   * ```typescript
   * video.thumbnail().width(500).build();
   * ```
   */
  thumbnail(): ImageUrlBuilder {
    return new ImageUrlBuilder(this);
  }

  /**
   * Export Video to JSON
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
   * Returns true if the provided fragment is a video
   * @param fragment
   */
  public static isVideo(fragment: any): boolean {
    return (
      FragmentMeta.isFragment(fragment) &&
      fragment._meta.schema ===
        'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link'
    );
  }
}
