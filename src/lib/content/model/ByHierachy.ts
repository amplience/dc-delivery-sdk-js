import { IContentMeta } from './ContentMeta';
import { ContentBody } from './ContentBody';

export interface HierarchyRequest {
  rootId: string;
  maximumDepth?: number;
  maximumPageSize?: number;
  pageCursor?: string;
}

export interface HierarchyPage {
  cursor: string;
  responseCount: number;
}

export interface HierarchyResponse<Body extends ContentBody> {
  responses: HierarchyContentResponse<Body>[];
  page: HierarchyPage;
}

export interface HierarchyContentResponse<Body extends ContentBody> {
  content: Body & IContentMeta;
}

export interface HierarchyContentItem<Body extends ContentBody> {
  content: ContentBody;
  children: HierarchyContentItem<Body>[];
}
