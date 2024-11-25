import { AxiosInstance } from 'axios';
import { ContentClientConfigV2 } from '../../config/ContentClientConfigV2';
import {
  FilterByRequest,
  FilterByResponse,
  IOrder,
  RequestOptions,
} from '../model/FilterBy';

import { FilterByImpl } from './FilterByImpl';

export class FilterBy<Body = any> {
  static SCHEMA_PATH = '/_meta/schema';
  static PARENT_PATH = '/_meta/hierarchy/parentId';

  private readonly filterByService: FilterByImpl<Body>;

  private requestConfig: FilterByRequest = {
    filterBy: [],
  };

  constructor(
    private readonly config: ContentClientConfigV2,
    private readonly contentClient: AxiosInstance
  ) {
    this.filterByService = new FilterByImpl(this.config, this.contentClient);
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
    return this.filterBy<string>(FilterBy.SCHEMA_PATH, value);
  }

  /**
   * Fetch content by parent id
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
  filterByParentId(value: string): FilterBy<Body> {
    return this.filterBy<string>(FilterBy.PARENT_PATH, value);
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

    return this.filterByService.fetch(this.requestConfig);
  }
}
