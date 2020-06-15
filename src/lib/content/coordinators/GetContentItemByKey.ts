import { ContentBody } from '../model/ContentBody';
import { ContentItem } from '../model/ContentItem';

export interface GetContentItemByKey {
  getContentItemByKey<T extends ContentBody>(
    key: string
  ): Promise<ContentItem<T>>;
}
