import { ContentClientConfig } from '../ContentClientConfig';
import { ImageMeta, VideoMeta } from './MediaMeta';

/**
 * @hidden
 * Base class for image or video resources.
 */
export abstract class Media {
  /**
   * Metadata about the Media object
   */
  _meta: ImageMeta | VideoMeta;

  /**
   * Default host name to use when constructing a URL to the resource.
   * Your application may override this value with a branded host name in the SDK configuration.
   */
  defaultHost: string;

  /**
   * Name of the account to use when constructing a URL to the resource.
   */
  endpoint: string;

  /**
   * Name of the media object to use when constructing a URL to the resource.
   */
  name: string;

  /**
   * ID of the media object
   */
  id: string;

  constructor(data: any, protected config: ContentClientConfig) {
    Object.assign(this, data);
  }

  /**
   * Returns the hostname that should be used to load this media resource.
   * The hostname will use the staging and media host overrides if specified
   * otherwise it will use the defaultHost provided by the delivery API.
   * @param secure
   */
  public getHost(secure: boolean): string {
    if (this.config.stagingEnvironment) {
      return this.config.stagingEnvironment;
    }

    if (secure) {
      return this.config.secureMediaHost || this.defaultHost;
    } else {
      return (
        this.config.mediaHost || this.config.secureMediaHost || this.defaultHost
      );
    }
  }

  /**
   * Export media object to JSON
   */
  toJSON(): any {
    return {
      defaultHost: this.defaultHost,
      endpoint: this.endpoint,
      name: this.name,
      id: this.id,
    };
  }
}
