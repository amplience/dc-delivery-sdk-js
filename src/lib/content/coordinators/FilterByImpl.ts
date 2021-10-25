import { AxiosInstance } from 'axios';
import { createContentClientV2 } from '../../client/createContentClientV2';
import { ContentClientConfigV2 } from '../../config/ContentClientConfigV2';
import { FilterByRequest, FilterByResponse } from '../model/FilterBy';
import { HttpError } from '../model/HttpError';

export class FilterByImpl<Body = any> {
  private readonly contentClient: AxiosInstance;

  constructor(private readonly config: ContentClientConfigV2) {
    this.contentClient = createContentClientV2(this.config);
  }

  async fetch(requestConfig: FilterByRequest): Promise<FilterByResponse<Body>> {
    try {
      if (!requestConfig.parameters?.locale && this.config?.locale) {
        requestConfig.parameters = Object.assign(
          {},
          {
            ...(requestConfig.parameters || {}),
            locale: this.config.locale,
          }
        );
      }

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

        data.page.next = () => this.fetch(request);
      }

      return data;
    } catch (err) {
      if (err.response) {
        throw new HttpError(err.response.status, err.response.data);
      }

      throw err;
    }
  }
}
