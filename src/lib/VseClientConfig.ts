import { AxiosAdapter } from 'axios';

/**
 * Configuration settings for Virtual Staging Environment API client. You can optionally
 * override these values with environment specific values.
 */
export interface VseClientConfig {
  /**
   * Allows custom handling of requests which makes testing and supporting non-standard environments easier.
   */
  adaptor?: AxiosAdapter;

  /**
   * Override for the vse API base URL.
   * E.g. https://staging-domain.com
   */
  baseUrl?: string;

  /**
   * Virtual Staging Environment domain used for the preview of content
   * E.g. 1dg9lsggokzjn1duyxyjho98t9.staging.bigcontent.io
   */
  vseDomain: string;
}
