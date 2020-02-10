import Axios, { AxiosInstance } from 'axios';
import { encodeQueryString } from '../utils/Url';
import { VseDomainFactoryConfig } from './VseDomainFactoryConfig';
import { GetDomainOptions } from './GetDomainOptions';

/**
 * Default VSEDomainFactory config
 */
const DefaultVseDomainFactoryConfig: VseDomainFactoryConfig = {
  baseUrl: 'https://virtual-staging.adis.ws'
};

/**
 * Amplience [Virtual Staging Environment](https://docs.amplience.net/virtualstaging/virtualstagingintro.html?h=vse) domain factory.
 *
 * This factory is intended to be used by end user applications to preview content for a given snapshotID or at a given timestamp.
 *
 * It works by submitting the virtual staging environment domain and the snapshotID or timestamp and submitting them to the virtual-staging API,
 * which will return a new domain that can be used in the ContentClient.
 *
 * Example:
 *
 * ```typescript
 * const factory = new VSEDomainFactory('11122222gggg232gg32g32g.staging.bigcontent.io');
 * const vseDomainWithSnapshot = await factory.getDomain({snapshotId: 'abcdef123456'});
 *
 * const client = new ContentClient({
 *   account: 'test',
 *   stagingEnvironment: vseDomainWithSnapshot
 * });
 *
 * ```
 *
 * You may override other settings when constructing the client but if no additional configuration is provided sensible defaults will be used.
 */
export class VseDomainFactory {
  private readonly vseClient: AxiosInstance;

  /**
   * Creates a Vse Client instance. You must provide a configuration object with the vse URL to use when making requests.
   * @param config Client configuration options
   */
  constructor(
    private readonly vseDomain: string,
    config: VseDomainFactoryConfig = {}
  ) {
    this.vseClient = this.createVseClient({
      ...DefaultVseDomainFactoryConfig,
      ...config
    });
  }

  /**
   * Get a new VSE domain name using the snapshotId and/or timestamp thats supplied in the options argument
   * @param options
   */
  getDomain(options: GetDomainOptions): Promise<string> {
    const url = this.buildUrl(options);

    return this.vseClient
      .get<string>(url)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(err => {
        return Promise.reject(
          `An error occurred whilst attempting to get VSE domain using options '${JSON.stringify(
            options
          )}': ${err.message}`
        );
      });
  }

  /**
   * Build the URL to invoke using the supplied GetDomainOptions
   * @param options GetDomainOptions
   */
  protected buildUrl(options: GetDomainOptions): string {
    const queryParameters = Object.entries(options).map(([key, value]) => [
      key,
      value.toString()
    ]);
    const queryString = encodeQueryString(queryParameters);
    return `/domain/${this.vseDomain}?${queryString}`;
  }

  /**
   * Create network client to make requests to the vse service
   * @param config
   */
  protected createVseClient(config: VseDomainFactoryConfig): AxiosInstance {
    const client = Axios.create({
      adapter: config.adaptor
    });
    client.defaults.baseURL = config.baseUrl;
    return client;
  }
}
