import { GetContentItemById } from './GetContentItemById';
import { GetContentItemByKey } from './GetContentItemByKey';
import { ContentBody } from '../model/ContentBody';
import { ContentItem } from '../model/ContentItem';

import { ContentMapper } from '../mapper/ContentMapper';
import { AxiosInstance, AxiosResponse } from 'axios';
import { encodeQueryString } from '../../utils/Url';
import { HttpError } from '../model/HttpError';
import { ContentNotFoundError } from '../model/ContentNotFoundError';
import { ContentClientConfigV2 } from '../../config';

/**
 * @hidden
 */
export class GetContentItemV2Impl
  implements GetContentItemById, GetContentItemByKey {
  constructor(
    private readonly config: ContentClientConfigV2,
    private readonly contentClient: AxiosInstance,
    private readonly mapper: ContentMapper
  ) {}

  getContentItemByKey<T extends ContentBody>(
    key: string
  ): Promise<ContentItem<T>> {
    return this.getContentItem('key', key);
  }
  async getContentItemById<T extends ContentBody>(
    id: string
  ): Promise<ContentItem<T>> {
    return this.getContentItem('id', id);
  }

  async getContentItem<T extends ContentBody>(
    requestType: 'id' | 'key',
    value: string
  ): Promise<ContentItem<T>> {
    const args = [
      ['depth', 'all'],
      ['format', 'inlined'],
    ];
    if (this.config.locale) {
      args.push(['locale', this.config.locale]);
    }
    const url = `content/${requestType}/${value}?${encodeQueryString(args)}`;

    let response: AxiosResponse;
    try {
      response = await this.contentClient.get(url);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          throw new ContentNotFoundError(value);
        } else {
          throw new HttpError(err.response.status, err.response.data);
        }
      }

      throw err;
    }

    const contentItem = new ContentItem<T>();
    contentItem.body = this.mapper.toMappedContent(response.data.content);
    return contentItem;
  }
}
