import { AxiosError } from 'axios';
import { ContentClientConfigV2 } from './ContentClientConfigV2';

export interface IContentClientRetryConfig {
  /**
   * The number of times to retry before failing
   * default: 3
   */
  retries?: number;
  /**
   * A callback to further control if a request should be retried. By default, it retries if the response.status is 429
   * default: () => response.status === 429
   */
  retryCondition?: (error: AxiosError) => boolean | Promise<boolean>;
  /**
   * A callback to further control the delay between retry requests. By default it is an exponential delay
   */
  retryDelay?: (retryCount: number, error: AxiosError) => number;
}

/**
 * Configuration settings for Content Delivery V2 Fresh API.
 */
export interface ContentClientConfigV2Fresh extends ContentClientConfigV2 {
  /**
   * The Fresh API key
   */
  apiKey?: string;
  /**
   * Override default retry configuration
   */
  retryConfig?: IContentClientRetryConfig;
}
