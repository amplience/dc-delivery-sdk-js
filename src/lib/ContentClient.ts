import { CommonContentClientConfig } from './config/CommonContentClientConfig';
import { RenderedContentItem } from './rendering/model/RenderedContentItem';
import { RenderContentItem } from './rendering/coordinators/RenderContentItem';
import { FilterBy } from './content/coordinators/FilterBy';
import { ContentItem } from './content/model/ContentItem';
import { ContentBody, DefaultContentBody } from './content/model/ContentBody';
import { GetContentItemV1Impl } from './content/coordinators/GetContentItemV1Impl';
import { ContentMapper } from './content/mapper/ContentMapper';
import { GetContentItemById } from './content/coordinators/GetContentItemById';
import { GetContentItemV2Impl } from './content/coordinators/GetContentItemV2Impl';
import { GetContentItemByKey } from './content/coordinators/GetContentItemByKey';
import { ContentClientConfigV1 } from './config/ContentClientConfigV1';
import { ContentClientConfigV2 } from './config/ContentClientConfigV2';
import { FilterByImpl } from './content/coordinators/FilterByImpl';
import { FilterByRequest, FilterByResponse } from './content/model/FilterBy';

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
export class ContentClient implements GetContentItemById, GetContentItemByKey {
  private readonly contentMapper: ContentMapper;

  /**
   * Creates a Delivery API Client instance. You must provide a configuration object with the account you wish to fetch content from.
   * @param config Client configuration options
   */
  constructor(
    private readonly config: ContentClientConfigV1 | ContentClientConfigV2
  ) {
    if (!config) {
      throw new TypeError('Parameter "config" is required');
    }

    if (
      !(config as ContentClientConfigV1).account &&
      !(config as ContentClientConfigV2).hubName
    ) {
      throw new TypeError(
        'Parameter "config" must contain a valid "account" name or "hubName" property'
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

    this.contentMapper = this.createContentMapper(config);
  }

  /**
   * @hidden
   */
  private isContentClientConfigV1(
    config: ContentClientConfigV1 | ContentClientConfigV2
  ): config is ContentClientConfigV1 {
    return (config as ContentClientConfigV1).account !== undefined;
  }

  /**
   * @hidden
   */
  private isContentClientConfigV2(
    config: ContentClientConfigV1 | ContentClientConfigV2
  ): config is ContentClientConfigV2 {
    return (config as ContentClientConfigV2).hubName !== undefined;
  }

  /**
   * @deprecated use getContentItemById
   */
  getContentItem<T extends ContentBody = DefaultContentBody>(
    contentItemId: string
  ): Promise<ContentItem<T>> {
    return this.getContentItemById(contentItemId);
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
   * * Content created using V1 of the CMS will be upgraded to the V2 format.
   *
   * You can convert the content back to plain JSON by calling the toJSON() function on the returned ContentItem.
   * @typeparam T The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @param id Unique id of the Content Item or Slot to load
   */
  getContentItemById<T extends ContentBody = DefaultContentBody>(
    id: string
  ): Promise<ContentItem<T>> {
    if (this.isContentClientConfigV2(this.config)) {
      return new GetContentItemV2Impl(
        this.config,
        this.contentMapper
      ).getContentItemById(id);
    }
    return new GetContentItemV1Impl(
      this.config,
      this.contentMapper
    ).getContentItemById(id);
  }

  /**
   * This function will load a Content Item or Slot by key and return a Promise of the result.
   * If the content is not found the promise will reject with an error.
   * If the content is found the promise will resolve with a parsed version of the content with all dependencies.
   *
   * A delivery key can be a simple string or a path such as "home-page/feature-banner". This makes it simpler to write your integration code and allows users more control over where items of content are delivered. You can add a delivery key to a slot in the Dynamic Content app or to a content item or slot using the Dynamic Content Management API.
   * Note that a delivery key may not start or end with "/" and must be between 1 and 150 characters. Delivery keys can contain the following alphanumeric characters: a to z, A to Z and 0 to 9. You can also include "-" and "_" and "/" as long as it is not included at the start or end of the key.
   *
   * The content body will match the format defined by your content type.
   *
   * Some pre-processing is applied to the content body to make it easier to work with:
   *
   * * Linked content items are joined together into the root content item to create a single JSON document.
   * * Media references (images and videos) are replaced with wrapper objects [[Image]] and [[Video]] which provide helper functions.
   * * Content created using V1 of the CMS will be upgraded to the V2 format.
   *
   * You can convert the content back to plain JSON by calling the toJSON() function on the returned ContentItem.
   * @typeparam T The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @param id Unique id of the Content Item or Slot to load
   */
  getContentItemByKey<T extends ContentBody = DefaultContentBody>(
    key: string
  ): Promise<ContentItem<T>> {
    if (!this.isContentClientConfigV2(this.config)) {
      throw new Error(
        'Not supported. You need to define "hubName" configuration property to use getContentItemByKey()'
      );
    }

    return new GetContentItemV2Impl(
      this.config,
      this.contentMapper
    ).getContentItemByKey(key);
  }

  /**
   * This function will help construct requests for filtering Content Items or Slots
   *
   * @param filterBy - API options for `/content/filter` endpoint [docs](https://amplience.com/docs/development/contentdelivery/filterandsort.html)
   * @returns
   */
  filterContentItems<Body = any>(
    filterBy: FilterByRequest
  ): Promise<FilterByResponse<Body>> {
    if (!this.isContentClientConfigV2(this.config)) {
      throw new Error(
        'Not supported. You need to define "hubName" configuration property to use filterContentItems()'
      );
    }

    return new FilterByImpl<Body>(this.config).fetch(filterBy);
  }

  /**
   *  This function will help construct requests for filtering Content Items or Slots
   *
   * @param path - json path to property you wish to filter by e.g `/_meta/schema`
   * @param value - value you want to return matches for
   *
   * @returns `FilterBy<Body>`
   */
  filterBy<Body = any, Value = any>(
    path: string,
    value: Value
  ): FilterBy<Body> {
    if (!this.isContentClientConfigV2(this.config)) {
      throw new Error(
        'Not supported. You need to define "hubName" configuration property to use filterBy()'
      );
    }

    return new FilterBy<Body>(this.config).filterBy<Value>(path, value);
  }

  /**
   *
   *  This function will help construct requests for filtering Content Items or Slots
   *
   *  equivalent to:
   *
   * ```ts
   *  client.filterBy('/_meta/schema', contentTypeUri)
   * ```
   *
   * @param contentTypeUri - Content Type Uri you want to filter
   *
   * @returns `FilterBy<Body>`
   */
  filterByContentType<Body = any>(contentTypeUri: string): FilterBy<Body> {
    if (!this.isContentClientConfigV2(this.config)) {
      throw new Error(
        'Not supported. You need to define "hubName" configuration property to use filterByContentType()'
      );
    }

    return new FilterBy<Body>(this.config).filterByContentType(contentTypeUri);
  }

  /**
   *  This function will help construct requests for filtering Content Items or Slots
   *
   * equivalent to:
   *
   * ```ts
   *  client.filterBy('/_meta/parentId', id)
   * ```
   *
   * @param id - ID of a Hierarchy Content Item
   *
   * @returns `FilterBy<Body>`
   */
  filterByParentId<Body = any>(id: string): FilterBy<Body> {
    if (!this.isContentClientConfigV2(this.config)) {
      throw new Error(
        'Not supported. You need to define "hubName" configuration property to use filterByParentId()'
      );
    }

    return new FilterBy<Body>(this.config).filterByParentId(id);
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
    if (!this.isContentClientConfigV1(this.config)) {
      throw new Error(
        'Not supported. You need to define "account" configuration property to use renderContentItem()'
      );
    }

    return new RenderContentItem(this.config).renderContentItem(
      contentItemId,
      templateName,
      customParameters
    );
  }

  /**
   * Creates a parser which converts content JSON into classes and objects used by the SDK
   * @param config
   * @hidden
   */
  protected createContentMapper(
    config: CommonContentClientConfig
  ): ContentMapper {
    return new ContentMapper(config);
  }
}
