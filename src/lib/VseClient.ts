import Axios, { AxiosInstance } from 'axios';
import { VseClientConfig } from './VseClientConfig';
import { GetSnapshotDomain } from './vse/coordinators/GetSnapshotDomain';

/**
 * Amplience [Virtual Staging Environment](https://docs.amplience.net/virtualstaging/virtualstagingintro.html?h=vse) client.
 *
 * This client is intended to be used by end user applications to preview content.
 *
 * You must provide some basic account information in order to create an instance of VseClient.
 *
 * Example:
 *
 * ```typescript
 * const client = new VseClient({
 *    vseDomain: '11122222gggg232gg32g32g.staging.bigcontent.io'
 * });
 * ```
 *
 * You may override other settings when constructing the client but if no additional configuration is provided sensible defaults will be used.
 */
export class VseClient {
  private readonly vseClient: AxiosInstance;

  /**
   * Creates a Vse Client instance. You must provide a configuration object with the vse URL to use when making requests.
   * @param config Client configuration options
   */
  constructor(private readonly config: VseClientConfig) {
    if (!config) {
      throw new TypeError('Parameter "config" is required');
    }

    if (!config.vseDomain || config.vseDomain.indexOf('://') !== -1) {
      throw new TypeError(
        'Parameter "config" must contain a valid "vseDomain"'
      );
    }

    this.vseClient = this.createVseClient(config);
  }

  /**
   * This function will fetch a vse URL that can be used to preview content.
   * If the vse is not found the promise will reject with an error.
   * If the snapshot is not found the promise will reject with an error.
   * If the snapshot is found the promise will resolve with a vse URL.
   *
   * @param snapshotId Unique id of the snapshot to load when calling the vse
   * @param timestamp The point in time to load the snapshot data from in epoch format
   */
  getSnapshotDomain(snapshotId: string, timestamp?: number): Promise<string> {
    return new GetSnapshotDomain(this.config, this.vseClient).getSnapshotDomain(
      snapshotId,
      timestamp
    );
  }

  /**
   * Create network client to make requests to the vse service
   * @param config
   */
  protected createVseClient(config: VseClientConfig): AxiosInstance {
    const client = Axios.create({
      adapter: config.adaptor
    });
    client.defaults.baseURL = config.baseUrl
      ? config.baseUrl
      : 'https://virtual-staging.adis.ws';

    return client;
  }
}
