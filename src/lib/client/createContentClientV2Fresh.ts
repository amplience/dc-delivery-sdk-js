import axiosRetry from 'axios-retry';
import { AxiosInstance } from 'axios';
import {
  ContentClientConfigV2Fresh,
  IContentClientRetryConfig,
} from '../config/ContentClientConfigV2Fresh';
import { createBaseContentClient } from './createBaseContentClient';

const isThrottled = (error) => error?.response?.status === 429;
const DEFAULT_RETRY_CONFIG: IContentClientRetryConfig = {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: isThrottled,
};

/**
 * Get retry config to be passed to axios-retry
 * @param retryConfig
 * @hidden
 */
export function getRetryConfig(
  retryConfig?: IContentClientRetryConfig
): IContentClientRetryConfig {
  return {
    retries: retryConfig?.retries ?? DEFAULT_RETRY_CONFIG.retries,
    retryDelay: retryConfig?.retryDelay ?? DEFAULT_RETRY_CONFIG.retryDelay,
    retryCondition:
      retryConfig?.retryCondition ?? DEFAULT_RETRY_CONFIG.retryCondition,
  };
}

/**
 * Create network client to make requests to the Fresh API service
 * @param config
 * @hidden
 */
export function createContentClientV2Fresh(
  config: ContentClientConfigV2Fresh,
  defaultHost
): AxiosInstance {
  const client = createBaseContentClient(config, defaultHost);
  client.defaults.headers.common['X-API-Key'] = config.apiKey;
  axiosRetry(client, getRetryConfig(config.retryConfig));
  return client;
}
