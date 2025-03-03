import { IContentMeta } from './ContentMeta';

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
  content: Body & IContentMeta;
  linkedContent?: Array<Record<string, any> & IContentMeta>;
}

export interface IFilterBy {
  path: string;
  value: any;
}

export type RequestType = 'id' | 'key';
export type IOrder = 'DESC' | 'ASC';

export interface ISortBy {
  key: string;
  order: IOrder;
}

export interface RequestOptions {
  depth?: 'all' | 'root';
  format?: 'inlined' | 'linked';
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
