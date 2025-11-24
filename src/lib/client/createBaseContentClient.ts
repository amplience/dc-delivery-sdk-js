import { CommonContentClientConfig } from '../config/CommonContentClientConfig';
import Axios, { AxiosInstance } from 'axios';

/**
 * Create base network client to make requests to the content delivery service
 * @param config
 * @hidden
 */
export function createBaseContentClient(
  config: CommonContentClientConfig,
  defaultHost: string
): AxiosInstance {
  const client = Axios.create({
    adapter: config.adaptor,
    timeout: config.timeout || 0,
  });

  if (config.stagingEnvironment) {
    client.defaults.baseURL = `https://${config.stagingEnvironment}`;
    if (config.previewKey) {
      client.defaults.headers['x-api-key'] = config.previewKey;
    }
  } else {
    client.defaults.baseURL = config.baseUrl || defaultHost;
  }
  return client;
}
