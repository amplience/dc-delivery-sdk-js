import axiosRetry from 'axios-retry';
import { createContentClient } from './createContentClient';
import { AxiosInstance } from 'axios';
import {
  ContentClientConfigV2Fresh,
  IContentClientRetryConfig,
} from '../config/ContentClientConfigV2Fresh';

const DEFAULT_RETRY_CONFIG: IContentClientRetryConfig = {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => error?.response?.status === 429,
};

/**
 * Create network client to make requests to the content delivery service
 * @param config
 * @hidden
 */
export function createContentClientConfigV2Fresh(
  config: ContentClientConfigV2Fresh,
  defaultHost
): AxiosInstance {
  const client = createContentClient(config, defaultHost);
  axiosRetry(client, {
    retries: config.retryConfig.retries ?? DEFAULT_RETRY_CONFIG.retries,
    retryDelay:
      config.retryConfig.retryDelay ?? DEFAULT_RETRY_CONFIG.retryDelay,
    retryCondition:
      config.retryConfig.retryCondition ?? DEFAULT_RETRY_CONFIG.retryCondition,
  });
  client.defaults.headers.common['X-API-Key'] = config.token;
  return client;
}
