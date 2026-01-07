import {
  CommonContentClientConfig,
  ContentClientConfigOptions,
  ContentClientConfigV1,
  ContentClientConfigV2,
  isContentClientConfigV1,
  isContentClientConfigV2,
} from './config';
import { RenderedContentItem } from './rendering/model/RenderedContentItem';
import { RenderContentItem } from './rendering/coordinators/RenderContentItem';
import { FilterBy } from './content/coordinators/FilterBy';
import { ContentItem } from './content/model/ContentItem';
import { ContentBody, DefaultContentBody } from './content/model/ContentBody';
import { GetContentItemV1Impl } from './content/coordinators/GetContentItemV1Impl';
import { ContentMapper } from './content/mapper/ContentMapper';
import { GetContentItemById } from './content/coordinators/GetContentItemById';
import { GetContentItemV2Impl } from './content/coordinators/GetContentItemV2Impl';
import { GetContentItemsV2Impl } from './content/coordinators/GetContentItemsV2Impl';
import { GetContentItemByKey } from './content/coordinators/GetContentItemByKey';
import { FilterByImpl } from './content/coordinators/FilterByImpl';
import { FilterByRequest, FilterByResponse } from './content/model/FilterBy';
import { AxiosInstance } from 'axios';
import { createContentClient } from './client/createContentClient';
import { FetchRequest, FetchResponse } from './content/model/Fetch';
import {
  NotSupportedV2Error,
  NotSupportedV1Error,
} from './content/model/NotSupportedError';
import {
  ByIdContentClientHierarchyRequest,
  ByKeyContentClientHierarchyRequest,
  ContentClientHierarchyRequest,
  HierarchyContentItem,
  HierarchyRequest,
  RequestType,
} from './content/model/ByHierachy';
import { GetHierarchyImpl } from './content/coordinators/GetByHierarchy/GetHierarchyImpl';
import { FilteringHierachyAssemblerImpl } from './content/coordinators/GetByHierarchy/assemblers/FilteringHierachyAssemblerImpl';
import { HierarchyAssemblerImpl } from './content/coordinators/GetByHierarchy/assemblers/HierarchyAssemblerImpl';
import { MutatingHierachyAssemblerImpl } from './content/coordinators/GetByHierarchy/assemblers/MutatingHierarchyAssembler';
import { FilteringAndMutatingHierarchyAssembler } from './content/coordinators/GetByHierarchy/assemblers/FilteringAndMutatingHierarchyAssembler';
import { HierarchyAssembler } from './content/coordinators/GetByHierarchy/assemblers/HierarchyAssembler';

/**
 * Amplience [Content Delivery API](https://docs.amplience.net/integration/deliveryapi.html?h=delivery) client.
 *
 * This client is intended to be used by end user applications to fetch content so that it can be displayed to users.
 *
 * You must provide some configuration options in order to create an instance of ContentClient.
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
  private readonly contentClient: AxiosInstance;

  /**
   * Creates a Delivery API Client instance. You must provide a configuration object with the required details for the particular service you wish to fetch content from.
   * @param config Client configuration options
   */
  constructor(private readonly config: ContentClientConfigOptions) {
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
    this.contentClient = createContentClient(config);
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
    if (isContentClientConfigV2(this.config)) {
      return new GetContentItemV2Impl(
        this.config,
        this.contentClient,
        this.contentMapper
      ).getContentItemById(id);
    }
    return new GetContentItemV1Impl(
      this.config,
      this.contentClient,
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
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('getContentItemByKey');
    }

    return new GetContentItemV2Impl(
      this.config,
      this.contentClient,
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
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('filterContentItems');
    }

    return new FilterByImpl<Body>(this.config, this.contentClient).fetch(
      filterBy
    );
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
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('filterBy');
    }

    return new FilterBy<Body>(this.config, this.contentClient).filterBy<Value>(
      path,
      value
    );
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
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('filterByContentType');
    }

    return new FilterBy<Body>(
      this.config,
      this.contentClient
    ).filterByContentType(contentTypeUri);
  }

  /**
   *  This function will help construct requests for filtering Content Items or Slots
   *
   * equivalent to:
   *
   * ```ts
   *  client.filterBy('/_meta/hierarchy/parentId', id)
   * ```
   *
   * @param id - ID of a Hierarchy Content Item
   *
   * @returns `FilterBy<Body>`
   */
  filterByParentId<Body = any>(id: string): FilterBy<Body> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('filterByParentId');
    }

    return new FilterBy<Body>(this.config, this.contentClient).filterByParentId(
      id
    );
  }

  /**
   *  This function will help construct requests for filtering Content Items or Slots
   *
   * equivalent to:
   *
   * ```ts
   *  client.lookUpBy('HIERARCHY_PARENT_META_DELIVERY_KEY', deliveryKey)
   * ```
   *
   * @param deliveryKey - ID of a Hierarchy Content Item
   *
   * @returns `FilterBy<Body>`
   */

  lookUpByHierarchyDeliveryKey<Body = any>(
    deliveryKey: string
  ): FilterBy<Body> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('filterByContentType');
    }

    return new FilterBy<Body>(
      this.config,
      this.contentClient
    ).lookUpByHierarchyDeliveryKey(deliveryKey);
  }

  /**
   *  This function will help construct requests for filtering Content Items or Slots
   *
   * equivalent to:
   *
   * ```ts
   *  client.lookUpBy(key, value)
   * ```
   *
   * @param key - the key for the lookup eg: HIERARCHY_PARENT_META_DELIVERY_KEY
   * @param value - the value for the lookup
   *
   * @returns `FilterBy<Body>`
   */
  lookUpBy<Body = any>(key: string, value: string): FilterBy<Body> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('filterByContentType');
    }

    return new FilterBy<Body>(this.config, this.contentClient).lookUpBy(
      key,
      value
    );
  }

  private async getHierarchyRootItem(
    rootId: string,
    requestParameters: ContentClientHierarchyRequest,
    requestType: RequestType
  ): Promise<ContentItem> {
    let rootItem: ContentItem;
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('getByHierarchy');
    }
    if (requestParameters.rootItem !== undefined) {
      rootItem = requestParameters.rootItem;
    } else {
      rootItem = await this.getRootItem(rootId, requestType);
    }
    if (requestType === 'id') {
      if (rootItem.body._meta.deliveryId != rootId) {
        throw new Error(
          `The root item id(${requestParameters.rootItem.body._meta.deliveryId}) ` +
            `does not match the request rootId(${rootId})`
        );
      }
    } else {
      if (
        rootItem.body._meta.deliveryKey !== rootId &&
        !rootItem.body._meta.deliveryKeys?.values
          .map((key) => key.value)
          .includes(rootId)
      ) {
        throw new Error(
          `The root item id(${requestParameters.rootItem.body._meta.deliveryKey}) ` +
            `does not match the request rootId(${rootId})`
        );
      }
    }
    return rootItem;
  }

  private async getRootItem(rootId: string, requestType: RequestType) {
    try {
      if (requestType === 'id') {
        return await this.getContentItemById(rootId);
      } else {
        return await this.getContentItemByKey(rootId);
      }
    } catch (err) {
      throw new Error(
        `Error while retrieving hierarchy root item: ${err.message}`
      );
    }
  }

  private async executeHierarchyRequest(
    requestParameters: ContentClientHierarchyRequest,
    deliveryType: RequestType
  ) {
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new HierarchyAssemblerImpl()
    );
  }

  private async executeHierarchyRequestWithAssembler(
    requestParameters: ContentClientHierarchyRequest,
    deliveryType: RequestType,
    hierarchyAssembler: HierarchyAssembler<ContentBody>
  ) {
    let rootId: string;
    if (deliveryType == 'id') {
      rootId = (requestParameters as ByIdContentClientHierarchyRequest).rootId;
    } else {
      rootId = (requestParameters as ByKeyContentClientHierarchyRequest)
        .rootKey;
    }
    const rootItem = await this.getHierarchyRootItem(
      rootId,
      requestParameters,
      deliveryType
    );
    const request: HierarchyRequest = {
      rootId: rootId,
      maximumDepth: requestParameters.maximumDepth,
      maximumPageSize: requestParameters.maximumPageSize,
      sortOrder: requestParameters.sortOrder,
      sortKey: requestParameters.sortKey,
      deliveryType: deliveryType,
    };

    if (this.config.locale) {
      request.locale = this.config.locale;
    }

    return await new GetHierarchyImpl(
      this.contentClient,
      hierarchyAssembler
    ).getHierarchyByRoot(request, rootItem);
  }

  /** This function will load a hierarchy and return the root item with any children attached,
   * it will also fetch the root item if needed.
   * @param requestParameters parameters for the hierarchies request see {@link ContentClientHierarchyRequest}
   * */
  async getByHierarchy<Body extends ContentBody = DefaultContentBody>(
    requestParameters: ByIdContentClientHierarchyRequest
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'id';
    return await this.executeHierarchyRequest(requestParameters, deliveryType);
  }

  async getHierarchyByKey<Body extends ContentBody = DefaultContentBody>(
    requestParameters: ByKeyContentClientHierarchyRequest
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'key';
    return await this.executeHierarchyRequest(requestParameters, deliveryType);
  }

  /** This function will load a hierarchy and return the root item with any children attached,
   * it will also fetch the root item if needed.
   * @param requestParameters parameters for the hierarchies request see {@link ContentClientHierarchyRequest}
   * @param filterFunction the function that is applied to filter the tree, elements are removed on a truthy result
   * */
  async getByHierarchyAndFilter<Body extends ContentBody = DefaultContentBody>(
    requestParameters: ByIdContentClientHierarchyRequest,
    filterFunction: (contentBody: Body) => boolean
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'id';
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new FilteringHierachyAssemblerImpl(filterFunction)
    );
  }

  async getHierarchyByKeyAndFilter<
    Body extends ContentBody = DefaultContentBody
  >(
    requestParameters: ByKeyContentClientHierarchyRequest,
    filterFunction: (contentBody: Body) => boolean
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'key';
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new FilteringHierachyAssemblerImpl(filterFunction)
    );
  }

  /** This function will load a hierarchy and return the root item with any children attached,
   * it will also fetch the root item if needed.
   * @param requestParameters parameters for the hierarchies request see {@link ContentClientHierarchyRequest}
   * @param mutationFunction the function that is applied to the content body while building the hierarchy
   * */
  async getByHierarchyAndMutate<Body extends ContentBody = DefaultContentBody>(
    requestParameters: ByIdContentClientHierarchyRequest,
    mutationFunction: (contentBody: Body) => Body
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'id';
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new MutatingHierachyAssemblerImpl(mutationFunction)
    );
  }

  async getHierarchyByKeyAndMutate<
    Body extends ContentBody = DefaultContentBody
  >(
    requestParameters: ByKeyContentClientHierarchyRequest,
    mutationFunction: (contentBody: Body) => Body
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'key';
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new MutatingHierachyAssemblerImpl(mutationFunction)
    );
  }

  async getByHierarchyFilterAndMutate<
    Body extends ContentBody = DefaultContentBody
  >(
    requestParameters: ByIdContentClientHierarchyRequest,
    filterFunction: (contentBody: Body) => boolean,
    mutationFunction: (contentBody: Body) => Body
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'id';
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new FilteringAndMutatingHierarchyAssembler(
        filterFunction,
        mutationFunction
      )
    );
  }

  async getHierarchyByKeyFilterAndMutate<
    Body extends ContentBody = DefaultContentBody
  >(
    requestParameters: ByKeyContentClientHierarchyRequest,
    filterFunction: (contentBody: Body) => boolean,
    mutationFunction: (contentBody: Body) => Body
  ): Promise<HierarchyContentItem<Body>> {
    const deliveryType: RequestType = 'key';
    return await this.executeHierarchyRequestWithAssembler(
      requestParameters,
      deliveryType,
      new FilteringAndMutatingHierarchyAssembler(
        filterFunction,
        mutationFunction
      )
    );
  }

  /**
   * These functions will help construct requests for fetching multiple Content Items or Slots by delivery ID
   * and is equivalent to:
   *
   * ```ts
   *  client.fetchContentItems({
   *    parameters: {
   *      depth: 'all',
   *      format: 'inlined'
   *    },
   *    requests: [
   *      { id: '6cd4de36-591b-4ca2-874b-1dec7b681d7e' },
   *      { id: 'c6d9e038-591b-4ca2-874b-da354f5d6e61' },
   *    ],
   *  });
   * ```
   *
   * @param keys An array of Delivery keys of the content you wish to fetch
   * @typeparam Body The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @returns `Promise<FetchResponse<Body>>`
   */
  getContentItemsById<Body = any>(
    ids: Array<string>
  ): Promise<FetchResponse<Body>> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('getContentItemsById');
    }
    return new GetContentItemsV2Impl(
      this.config,
      this.contentClient
    ).getContentItemsById(ids);
  }

  /**
   * This function will help construct requests for fetching multiple Content Items or Slots by delivery key
   * and is equivalent to:
   *
   * ```ts
   *  client.fetchContentItems({
   *    parameters: {
   *      depth: 'all',
   *      format: 'inlined'
   *    },
   *    requests: [
   *      { key: 'blog/article-1' },
   *      { key: 'blog/article-2' },
   *    ],
   *  });
   * ```
   *
   * @param keys An array of delivery IDs of the content you wish to fetch
   * @typeparam Body The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @returns `Promise<FetchResponse<Body>>`
   */
  getContentItemsByKey<Body = any>(
    keys: Array<string>
  ): Promise<FetchResponse<Body>> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('getContentItemsByKey');
    }
    return new GetContentItemsV2Impl(
      this.config,
      this.contentClient
    ).getContentItemsByKey(keys);
  }

  /**
   * This function will help construct requests for fetching multiple Content Items or Slots by delivery key and/or id
   * and is equivalent to:
   *
   * ```ts
   *  client.fetchContentItems({
   *    parameters: {
   *      depth: 'all',
   *      format: 'inlined'
   *    },
   *    requests: [
   *      { id: '6cd4de36-591b-4ca2-874b-1dec7b681d7e' },
   *      { key: 'blog/article-1' },
   *    ],
   *  });
   * ```
   *
   * @param requests An array of delivery IDs of the content you wish to fetch
   * @param parameters Optional override of default parameters
   * @typeparam Body The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @returns `Promise<FetchResponse<Body>>`
   */
  getContentItems<Body = any>(
    requests: FetchRequest['requests'],
    parameters?: FetchRequest['parameters']
  ): Promise<FetchResponse<Body>> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('getContentItems');
    }
    return new GetContentItemsV2Impl(
      this.config,
      this.contentClient
    ).getContentItems(requests, parameters);
  }

  /**
   * This function will help construct requests for fetching multiple Content Items or Slots by delivery key or ID. Wraps [`/content/fetch`](https://amplience.com/docs/api/dynamic-content/delivery/content-delivery-2/index.html#operation/multiGetContent) endpoint.
   * [Additional documentation](https://amplience.com/docs/development/contentdelivery/readme.html#multipleitems)
   *
   * @param body The request body. Can include per item parameters as well as global parameters
   * @typeparam Body The type of content returned. This is optional and by default the content returned is assumed to be “any”.
   * @returns `Promise<FetchResponse<Body>>`
   */
  fetchContentItems<Body = any>(
    body: FetchRequest
  ): Promise<FetchResponse<Body>> {
    if (!isContentClientConfigV2(this.config)) {
      throw new NotSupportedV2Error('fetchContentItems');
    }
    return new GetContentItemsV2Impl(
      this.config,
      this.contentClient
    ).fetchContentItems(body);
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
    if (!isContentClientConfigV1(this.config)) {
      throw new NotSupportedV1Error('renderContentItem');
    }

    return new RenderContentItem(
      this.config,
      this.contentClient
    ).renderContentItem(contentItemId, templateName, customParameters);
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
