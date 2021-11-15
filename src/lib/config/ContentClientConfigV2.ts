import { CommonContentClientConfig } from './CommonContentClientConfig';

/**
 * Configuration settings for Content Delivery V2 API.
 */

export interface ContentClientConfigV2 extends CommonContentClientConfig {
  /**
   * Hub name to retrieve content from, used in creating the Content Delivery V2 and Fresh API hostname, which contains the hub name
   * Example: <hubName>.cdn.content.amplience.net or <hubName>.fresh.content.amplience.net
   */
  hubName: string;
}
