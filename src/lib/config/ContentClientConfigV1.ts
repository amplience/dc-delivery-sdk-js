import { CommonContentClientConfig } from './CommonContentClientConfig';

/**
 * Configuration settings for Content Delivery V1 API.
 */
export interface ContentClientConfigV1 extends CommonContentClientConfig {
  /**
   * Account to retrieve content from.
   */
  account: string;
}
