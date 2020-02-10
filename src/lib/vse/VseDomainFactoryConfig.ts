import { AxiosAdapter } from 'axios';

/**
 * Configuration settings for Virtual Staging Environment Domain Factory. You can optionally
 * override these values with environment specific values.
 */
export interface VseDomainFactoryConfig {
  /**
   * Allows custom handling of requests which makes testing and supporting non-standard environments easier.
   */
  adaptor?: AxiosAdapter;

  /**
   * Override for the vse API base URL.
   * E.g. https://virtual-staging.adis.ws
   */
  baseUrl?: string;
}
