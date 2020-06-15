import { ContentBody } from '../model/ContentBody';
import { ContentItem } from '../model/ContentItem';

export interface GetContentItemById {
  getContentItemById<T extends ContentBody>(
    id: string
  ): Promise<ContentItem<T>>;
}
