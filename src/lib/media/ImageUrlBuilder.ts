import { Media } from './Media';
import { ImageFormat } from './model/ImageFormat';

/**
 * Utility which helps construct URLs to image resources hosted using the Amplience Dynamic Media platform.
 *
 * Commonly used transformations can chained together by calling the appropriate function on the builder.
 * Advanced transformations can be used by configuring a transformation template within the Amplience
 * back-office and applying the template to the builder.
 */
export class ImageUrlBuilder {
  private _protocol: string = 'https';
  private _host: string;
  private _format: ImageFormat;
  private _seoFileName: string;
  private readonly _query: string[] = [];

  constructor(private readonly media: Media) {}

  /**
   * Protocol configures what protocol style to use when building the image URL.
   *
   * ```{{protocol}}[:]//images.site.com/i/account/image```
   * @param value URL protocol, valid values are: http, https and // for protocol relative URLs
   */
  protocol(value: string): this {
    this._protocol = value;
    return this;
  }

  /**
   * Host configures the hostname to use when building the image URL.
   * By default, the SDK will use the most appropriate hostname based on
   * the SDK configuration.
   *
   * ```https://{{host}}/i/account/image```
   * @param value Hostname to use instead of the default value.
   */
  host(value: string): this {
    this._host = value;
    return this;
  }

  /**
   * Format converts the image to the file format specified.
   * The format will be appended to the URL as a file extension.
   *
   * ```https://images.site.com/i/account/image.webp```
   * @param value  Images format to use when encoding the output.
   */
  format(value: ImageFormat): this {
    this._format = value;
    return this;
  }

  /**
   * SEO filename allows a custom filename to be used to improve SEO.
   *
   * ```https://images.site.com/i/account/image/{{seoFileName}}```
   * @param value
   */
  seoFileName(value: string): this {
    this._seoFileName = value;
    return this;
  }

  /**
   * Template applies a transformation template to the image, which will
   * apply all of the transformation parameters contained in the template to the image.
   *
   * ```https://images.site.com/i/account/image?${{name}}$```
   * @param name The name of the transformation template previously configured in the Amplience back-office.
   */
  template(name: string): this {
    this._query.push(`$${encodeURIComponent(name)}$`);
    return this;
  }

  /**
   * Parameter appends the specified parameter to the query string. This can be used to
   * pass variables into templates.
   *
   * ```https://images.site.com/i/account/image?{{name}}={{value}}```
   * @param name
   * @param value
   */
  parameter(name: string, value: string): this {
    this._query.push(
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    );
    return this;
  }

  /**
   * Quality sets the compression level for the image output
   *
   * ```https://images.site.com/i/account/image?qlt={{value}}```
   * @param value The quality percentage (0-100)
   */
  quality(value: number): this {
    this._query.push(`qlt=${value}`);
    return this;
  }

  /**
   * Sharpen applies an unsharp mask to the image to refine edges or make an image look more crisp.
   *
   * ```https://images.site.com/i/account/image?unsharp={{radius}},{{sigma}},{{amount}},{{threshold}}```
   *
   * @param radius The radius of the Gaussian, in pixels, not counting the center pixel.
   * @param sigma The standard deviation of the Gaussian, in pixels.
   * @param amount The percentage of the difference between the original and the blur image that is added back into the original.
   * @param threshold The threshold, as a fraction of MaxRGB, needed to apply the difference amount.
   */
  sharpen(
    radius: number = 0,
    sigma: number = 1,
    amount: number = 1,
    threshold: number = 0.05
  ): this {
    this._query.push(`unsharp=${radius},${sigma},${amount},${threshold}`);
    return this;
  }

  /**
   * Width resizes an image to the pixel size provided. If you only provide one axis,
   * the other will be calculated to maintain aspect ratio. Use the scale mode parameter
   * to apply different resize effects like stretch or crop.
   *
   * ```https://images.site.com/i/account/image?w={{value}}```
   * @param value The new width in pixels.
   */
  width(value: number): this {
    this._query.push(`w=${value}`);
    return this;
  }

  /**
   * Height resizes an image to the pixel size provided. If you only provide one axis,
   * the other will be calculated to maintain aspect ratio. Use the scale mode parameter
   * to apply different resize effects like stretch or crop.
   *
   * ```https://images.site.com/i/account/image?h={{value}}```
   * @param value The new height in pixels.
   */
  height(value: number): this {
    this._query.push(`h=${value}`);
    return this;
  }

  /**
   * Returns the fully constructed URL for this image with any transformations.
   */
  build(): string {
    const isSecure = this._protocol === '//' || this._protocol === 'https';
    const isVideo =
      this.media._meta &&
      this.media._meta.schema ===
        'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link';

    let url = this._protocol === '//' ? '//' : `${this._protocol}://`;
    const host = this._host ? this._host : this.media.getHost(isSecure);

    url += host;
    url += `/${isVideo ? 'v' : 'i'}/`;
    url += encodeURIComponent(this.media.endpoint);
    url += '/';
    url += encodeURIComponent(this.media.name);

    if (this._seoFileName) {
      url += '/';
      url += encodeURIComponent(this._seoFileName);
    }

    if (this._format) {
      url += `.${this._format}`;
    }

    if (this._query.length > 0) {
      url += '?';
      url += this._query.join('&');
    }

    return url;
  }
}
