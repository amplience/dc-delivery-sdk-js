import { AxiosAdapter } from 'axios';

/**
 * Configuration settings for Content Delivery API client. You can optionally
 * override these values with environment specific values.
 */
export interface CommonContentClientConfig {
  /**
   * Allows custom handling of requests which makes testing and supporting non-standard environments easier.
   */
  adaptor?: AxiosAdapter;

  /**
   * If set, the SDK will request content and media from the staging environment host name specified.
   * This will override any values set for “baseUrl”, “mediaHost” and “secureMediaHost”.
   */
  stagingEnvironment?: string;

  /**
   * If set with `stagingEnvironment`, the SDK will send requests to the signing proxy address instead
   */

  signingProxyAddress?: string;

  /**
   * If set with `stagingEnvironment`, the SDK will send `previewKey` as an `x-api-key` header
   */

  previewKey?: string;

  /**
   * If set, the SDK will request content using the locale settings provided.
   * If your content contains any localized fields, this will cause a single
   * locale to be returned rather than the complete list of values.
   */
  locale?: string;

  /**
   * Allows users with custom hostnames to override the hostname used when constructing media URLs.
   * E.g. images.mywebsite.com.
   */
  mediaHost?: string;

  /**
   * Allows users with custom hostnames to override the hostname used when constructing secure media URLs.
   * E.g. images.mywebsite.com.
   */
  secureMediaHost?: string;

  /**
   * Override for the content delivery API base URL. If “stagingEnvironment” is set the sdk will automatically
   * update the baseUrl to load content from the virtual staging environment.
   */
  baseUrl?: string;

  /**
   * If set, requests made will timeout after the number of milliseconds specified in this field.
   * Set to 0 to disable timeout. Defaults to 0.
   */
  timeout?: number;
}
