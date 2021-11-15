import { AxiosInstance } from 'axios';
import {
  ContentClientConfigOptions,
  isContentClientConfigV2,
  isContentClientConfigV2Fresh,
} from '../config';
import { createContentClientV2Fresh } from './createContentClientV2Fresh';
import { createBaseContentClient } from './createBaseContentClient';

/**
 * Create network client to make requests to the content delivery service
 * @param config
 * @hidden
 */
export function createContentClient(
  config: ContentClientConfigOptions
): AxiosInstance {
  if (isContentClientConfigV2Fresh(config)) {
    return createContentClientV2Fresh(
      config,
      `https://${config.hubName}.fresh.content.amplience.net`
    );
  }

  if (isContentClientConfigV2(config)) {
    return createBaseContentClient(
      config,
      `https://${config.hubName}.cdn.content.amplience.net`
    );
  }

  return createBaseContentClient(config, 'https://cdn.c1.amplience.net');
}
