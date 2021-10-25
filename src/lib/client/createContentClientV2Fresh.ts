import axiosRetry from 'axios-retry';
import { createContentClient } from './createContentClient';
import { AxiosInstance } from 'axios';
import { ContentClientConfigV2Fresh } from '../config/ContentClientConfigV2Fresh';

/**
 * Create network client to make requests to the content delivery service
 * @param config
 * @hidden
 */

export function createContentClientConfigV2FreshClient(
  config: ContentClientConfigV2Fresh,
  defaultHost
): AxiosInstance {
  const client = createContentClient(config, defaultHost);
  const retryConfig = {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => error?.response?.status === 429,
    ...(config.retryConfig || {}),
  };
  axiosRetry(client, retryConfig);
  client.defaults.headers.common['X-API-Key'] = config.token;
  return client;
}
