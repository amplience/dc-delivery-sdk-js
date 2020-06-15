import { ContentClientConfig } from '../ContentClientConfig';
import Axios, { AxiosInstance } from 'axios';

/**
 * Create network client to make requests to the content delivery service
 * @param config
 */
export function createContentClient(
  config: ContentClientConfig
): AxiosInstance {
  const client = Axios.create({
    adapter: config.adaptor
  });

  if (config.stagingEnvironment) {
    client.defaults.baseURL = `https://${config.stagingEnvironment}`;
  } else {
    client.defaults.baseURL = config.baseUrl || 'https://c1.adis.ws';
  }
  return client;
}
