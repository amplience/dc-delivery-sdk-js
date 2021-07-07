import { AxiosInstance } from 'axios';
import { createContentClient } from '../../client/createContentClient';
import { ContentClientConfigV2 } from '../../config/ContentClientConfigV2';

export interface IPageResponse<Body> {
  responseCount: number;
  nextCursor?: string;
  next?: () => Promise<FilterByResponse<Body>>;
}

export interface FilterByResponse<Body> {
  responses: ContentItemResponse<Body>[];
  page: IPageResponse<Body>;
}

export interface ContentItemResponse<Body = any> {
  content: Body & {
    _meta: {
      name: string;
      schema: string;
      deliveryId: string;
      deliveryKey?: string;
      parentId?: string;
    };
  };
}

export interface IFilterBy {
  path: string;
  value: any;
}

export type IOrder = 'DESC' | 'ASC';

export interface ISortBy {
  key: string;
  order: IOrder;
}

export interface RequestOptions {
  depth: 'all' | 'root';
  format: 'inlined' | 'linked';
  locale?: string;
}

export interface IPage {
  size: number;
  cursor?: string;
}

export interface FilterByRequest {
  filterBy: Array<IFilterBy>;
  sortBy?: ISortBy;
  page?: Partial<Omit<IPage, 'next'>>;
  parameters?: RequestOptions;
}

export class FilterBy<Body = any> {
  private requestConfig: FilterByRequest = {
    filterBy: [],
  };
  private readonly contentClient: AxiosInstance;
  private readonly SCHEMA_PATH = '/_meta/schema';
  private readonly PARENT_PATH = '/_meta/parentId';

  constructor(private readonly config: ContentClientConfigV2) {
    this.contentClient = createContentClient(
      this.config,
      `https://${config.hubName}.cdn.content.amplience.net`
    );
  }

  /**
   *  This function will help construct requests for filtering Content Items or Slots
   *
   * @param path - json path to the property you wish to filter by e.g `/_meta/schema`
   * @param value - value you want to return matches for
   *
   * @returns `FilterBy<Body>`
   */
  filterBy<T = any>(path: string, value: T): FilterBy<Body> {
    this.requestConfig.filterBy.push({
      path,
      value,
    });

    return this;
  }

  /**
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
  filterByContentType(value: string): FilterBy<Body> {
    return this.filterBy<string>(this.SCHEMA_PATH, value);
  }

  /**
   * Fetch content by parent id
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
  filterByParentId(value: string): FilterBy<Body> {
    return this.filterBy<string>(this.PARENT_PATH, value);
  }

  /**
   * Set sortable key based on schema [`trait:sortable`](https://amplience.com/docs/development/contentdelivery/filterandsort.html#sorttrait)
   *
   *
   * @param key - key you wish to sort by
   * @param order - order enum ASC, DESC
   *
   * @returns `FilterBy<Body>`
   */
  sortBy(key: string, order: IOrder): FilterBy<Body> {
    this.requestConfig.sortBy = {
      key,
      order,
    };

    return this;
  }

  /**
   * Set page size and page cursor
   *
   * @param size - page size maximum  of 12
   * @param cursor - an encoded string that points to the next page
   */
  page(size: number, cursor?: string): FilterBy<Body>;
  /**
   * set page cursor
   *
   * @param cursor - an encoded string that points to the next page
   */
  page(cursor: string): FilterBy<Body>;

  page(size: number | string, cursor?: string): FilterBy<Body> {
    if (!this.requestConfig.page) {
      this.requestConfig.page = {};
    }

    if (arguments.length === 1 && typeof size === 'string') {
      this.requestConfig.page.cursor = size;

      return this;
    }

    if (typeof size === 'number') {
      this.requestConfig.page.size = size;
    }

    if (cursor) {
      this.requestConfig.page.cursor = cursor;
    }

    return this;
  }

  /**
   *
   * @param parameters - api options for response format
   *
   * @returns `FilterBy<Body>`
   */
  async request(parameters?: RequestOptions): Promise<FilterByResponse<Body>> {
    if (parameters) {
      this.requestConfig.parameters = parameters;
    }

    return this.__request(this.requestConfig);
  }

  async __request(
    requestConfig: FilterByRequest
  ): Promise<FilterByResponse<Body>> {
    const { data } = await this.contentClient.post<FilterByResponse<Body>>(
      'content/filter',
      requestConfig
    );

    if (data.page.nextCursor) {
      const request = Object.assign(
        {},
        {
          ...requestConfig,
          page: {
            ...(requestConfig.page || {}),
            cursor: data.page.nextCursor,
          },
        }
      );

      data.page.next = () => this.__request(request);
    }

    return data;
  }
}
