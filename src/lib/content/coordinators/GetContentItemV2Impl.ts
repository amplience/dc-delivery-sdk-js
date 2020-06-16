import { GetContentItemById } from './GetContentItemById';
import { GetContentItemByKey } from './GetContentItemByKey';
import { ContentBody } from '../model/ContentBody';
import { ContentItem } from '../model/ContentItem';
import { createContentClient } from '../../client/createContentClient';
import { ContentMapper } from '../mapper/ContentMapper';
import { AxiosInstance, AxiosResponse } from 'axios';
import { encodeQueryString } from '../../utils/Url';
import { ContentClientConfigV2 } from '../../config/ContentClientConfigV2';

export class GetContentItemV2Impl
  implements GetContentItemById, GetContentItemByKey {
  private readonly contentClient: AxiosInstance;

  constructor(
    private readonly config: ContentClientConfigV2,
    private readonly mapper: ContentMapper
  ) {
    this.contentClient = createContentClient(
      this.config,
      `https://${config.hubName}.cdn.content.amplience.net`
    );
  }

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
    const args = [['depth', 'all'], ['format', 'inlined']];
    if (this.config.locale) {
      args.push(['locale', this.config.locale]);
    }
    const url = `content/${requestType}/${value}?${encodeQueryString(args)}`;

    let response: AxiosResponse;
    try {
      response = await this.contentClient.get(url);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new Error(`Content item "${value}" was not found`);
      }

      throw err;
    }

    const contentItem = new ContentItem<T>();
    contentItem.body = this.mapper.toMappedContent(response.data.content);
    return contentItem;
  }
}
