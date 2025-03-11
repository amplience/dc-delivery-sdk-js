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

export interface FilterByComponent {
  value: any;
}

export interface IFilterBy extends FilterByComponent {
  path: string;
}

export interface IFilterByLookUp extends FilterByComponent {
  lookupBy: string;
  value: string;
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
  filterBy: Array<FilterByComponent>;
  sortBy?: ISortBy;
  page?: Partial<Omit<IPage, 'next'>>;
  parameters?: RequestOptions;
}
