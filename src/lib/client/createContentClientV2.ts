import { createContentClient } from './createContentClient';
import { AxiosInstance } from 'axios';

import { ContentClientConfigV2, isContentClientConfigV2Fresh } from '../config';
import { createContentClientV2Fresh } from './createContentClientV2Fresh';

/**
 * Create network client to make requests to the content delivery service
 * @param config
 * @hidden
 */
export function createContentClientV2(
  config: ContentClientConfigV2
): AxiosInstance {
  if (isContentClientConfigV2Fresh(config)) {
    return createContentClientV2Fresh(
      config,
      `https://${config.hubName}.fresh.content.amplience.net`
    );
  }
  return createContentClient(
    config,
    `https://${config.hubName}.cdn.content.amplience.net`
  );
}
