import { CommonContentClientConfig } from '../config/CommonContentClientConfig';
import Axios, { AxiosInstance } from 'axios';

/**
 * Create network client to make requests to the content delivery service
 * @param config
 * @hidden
 */
export function createContentClient(
  config: CommonContentClientConfig,
  defaultHost
): AxiosInstance {
  const client = Axios.create({
    adapter: config.adaptor,
    timeout: config.timeout || 0,
  });

  if (config.stagingEnvironment) {
    client.defaults.baseURL = `https://${config.stagingEnvironment}`;
  } else {
    client.defaults.baseURL = config.baseUrl || defaultHost;
  }
  return client;
}

export function createContentClientFresh(
  config: CommonContentClientConfig,
  defaultHost
): AxiosInstance {
  const client = Axios.create({
    timeout: config.timeout || 0,
  });

  if (config.stagingEnvironment) {
    client.defaults.baseURL = `https://${config.stagingEnvironment}`;
  } else {
    client.defaults.baseURL = config.baseUrl || defaultHost;
  }
  return client;
}
