import { ContentClientConfig } from './ContentClientConfig';
import Axios, { AxiosInstance } from 'axios';
import { RenderedContentItem } from './rendering/model/RenderedContentItem';
import { RenderContentItem } from './rendering/coordinators/RenderContentItem';
import { ContentItem } from './content/model/ContentItem';
import { ContentBody, DefaultContentBody } from './content/model/ContentBody';
import { GetContentItem } from './content/coordinators/GetContentItem';
import { ContentMapper } from './content/mapper/ContentMapper';

/**
 * Amplience [Content Delivery API](https://docs.amplience.net/integration/deliveryapi.html?h=delivery) client.
 *
 * This client is intended to be used by end user applications to fetch content so that it can be displayed to users.
 *
 * You must provide some basic account information in order to create an instance of ContentClient.
 *
 * Example:
 *
 * ```typescript
 * const client = new ContentClient({
 *    account: 'test'
 * });
 * ```
 *
 * You may override other settings when constructing the client but if no additional configuration is provided sensible defaults will be used.
 */
export class ContentClient {
  private readonly contentClient: AxiosInstance;
  private readonly contentMapper: ContentMapper;

  /**
   * Creates a Delivery API Client instance. You must provide a configuration object with the account you wish to fetch content from.
   * @param config Client configuration options
   */
  constructor(private readonly config: ContentClientConfig) {
    if (!config) {
      throw new TypeError('Parameter "config" is required');
    }

    if (!config.account) {
      throw new TypeError(
        'Parameter "config" must contain a valid "account" name'
      );
    }

    if (
      config.stagingEnvironment &&
      config.stagingEnvironment.indexOf('://') !== -1
    ) {
      throw new TypeError(
        'Parameter "stagingEnvironment" should be a hostname not a URL'
      );
    }

    this.contentClient = this.createContentClient(config);
    this.contentMapper = this.createContentMapper(config);
  }

  /**
   * This function will load a Content Item or Slot by id and return a Promise of the result.
   * If the content is not found the promise will reject with an error.
   * If the content is found the promise will resolve with a parsed version of the content with all dependencies.
   *
   * The content body will match the format defined by your content type, however keep in mind that if you have evolved your content type some published content may still be in the older format.
   *
   * Some pre-processing is applied to the content body to make it easier to work with:
   *
   * * Linked content items are joined together into the root content item to create a single JSON document.
   * * Media references (images and videos) are replaced with wrapper objects [[Image]] and [[Video]] which provide helper functions.
   *
   * You can convert the content back to plain JSON by calling the toJSON() function on the returned ContentItem.
   * @typeparam T The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @param id Unique id of the Content Item or Slot to load
   */
  getContentItem<T extends ContentBody = DefaultContentBody>(
    contentItemId: string
  ): Promise<ContentItem<T>> {
    return new GetContentItem(
      this.config,
      this.contentClient,
      this.contentMapper
    ).getContentItem(contentItemId);
  }

  /**
   * Converts a Content Item or Slot into a custom format (e.g. HTML / XML) by applying a template server side.
   * @param contentItemId Unique id of the Content Item or Slot to convert using the rendering service
   * @param templateName Name of the template to render the content item or slot with. The template must be setup in your account
   * @param customParameters Custom parameters which will be sent to the rendering API and made avaliable to your template
   */
  renderContentItem(
    contentItemId: string,
    templateName: string,
    customParameters?: { [id: string]: string }
  ): Promise<RenderedContentItem> {
    return new RenderContentItem(
      this.config,
      this.contentClient
    ).renderContentItem(contentItemId, templateName, customParameters);
  }

  /**
   * Create network client to make requests to the content delivery service
   * @param config
   */
  protected createContentClient(config: ContentClientConfig): AxiosInstance {
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

  /**
   * Creates a parser which converts content JSON into classes and objects used by the SDK
   * @param config
   */
  protected createContentMapper(config: ContentClientConfig): ContentMapper {
    return new ContentMapper(config);
  }
}
