import Axios, { AxiosInstance } from 'axios';
import { encodeQueryString } from '../utils/Url';
import { StagingEnvironmentFactoryConfig } from './StagingEnvironmentFactoryConfig';
import { GenerateDomainOptions } from './GenerateDomainOptions';

/**
 * Default StagingEnvironmentFactoryConfig values
 */
const DefaultStagingEnvironmentFactoryConfig: StagingEnvironmentFactoryConfig = {
  baseUrl: 'https://virtual-staging.amplience.net',
};

/**
 * Amplience [Virtual Staging Environment](https://docs.amplience.net/virtualstaging/virtualstagingintro.html?h=vse) factory.
 *
 * This factory is intended to be used by end user applications to preview content for a given snapshotID or at a given timestamp.
 *
 * It works by passing the virtual staging environment domain and the snapshotID or timestamp to the virtual-staging API,
 * which will return a new domain that can be used in the ContentClient.
 *
 * Example:
 *
 * ```typescript
 * const factory = new StagingEnvironmentFactory('11122222gggg232gg32g32g.staging.bigcontent.io');
 * const stagingEnvironmentWithSnapshot = await factory.generateDomain({snapshotId: 'abcdef123456'});
 *
 * const client = new ContentClient({
 *   account: 'test',
 *   stagingEnvironment: stagingEnvironmentWithSnapshot
 * });
 *
 * ```
 *
 * You may override other settings when constructing the client but if no additional configuration is provided sensible defaults will be used.
 */
export class StagingEnvironmentFactory {
  private readonly client: AxiosInstance;

  /**
   * Creates a StagingEnvironmentFactory instance.
   * @param string stagingEnvironment
   * @param config Client configuration options
   */
  constructor(
    private readonly stagingEnvironment: string,
    config: StagingEnvironmentFactoryConfig = {}
  ) {
    this.client = this.createClient({
      ...DefaultStagingEnvironmentFactoryConfig,
      ...config,
    });
  }

  /**
   * Generates a new staging environment domain name using the snapshotId and/or timestamp thats supplied in the options argument
   * @param options
   */
  async generateDomain(options: GenerateDomainOptions): Promise<string> {
    try {
      const url = this.buildUrl(options);
      const response = await this.client.get<string>(url);
      return response.data;
    } catch (err) {
      throw new Error(
        `An error occurred whilst attempting to generate a staging environment domain using options '${JSON.stringify(
          options
        )}': ${err.message}`
      );
    }
  }

  /**
   * Build the URL to invoke using the supplied GenerateDomainOptions
   * @param options GenerateDomainOptions
   */
  protected buildUrl(options: GenerateDomainOptions): string {
    const queryParameters = Object.entries(options).map(([key, value]) => [
      key,
      value.toString(),
    ]);
    const queryString = encodeQueryString(queryParameters);
    return `/domain/${this.stagingEnvironment}?${queryString}`;
  }

  /**
   * Create network client to make requests to the vse service
   * @param config
   */
  protected createClient(
    config: StagingEnvironmentFactoryConfig
  ): AxiosInstance {
    const client = Axios.create({
      adapter: config.adaptor,
    });
    client.defaults.baseURL = config.baseUrl;
    return client;
  }
}
