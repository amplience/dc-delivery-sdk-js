import { AxiosAdapter } from 'axios';

/**
 * Configuration settings for StagingEnvironmentFactory. You can optionally override these values with environment specific values.
 */
export interface StagingEnvironmentFactoryConfig {
  /**
   * Allows custom handling of requests which makes testing and supporting non-standard environments easier.
   */
  adaptor?: AxiosAdapter;

  /**
   * Override for the virtual staging API base URL.
   * E.g. https://virtual-staging.adis.ws
   */
  baseUrl?: string;
}
