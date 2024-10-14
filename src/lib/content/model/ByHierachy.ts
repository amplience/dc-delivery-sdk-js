import { IContentMeta } from './ContentMeta';
import { ContentBody } from './ContentBody';
import { ContentItem } from './ContentItem';

export interface HierarchyRequest {
  rootId: string;
  maximumDepth?: number;
  maximumPageSize?: number;
  pageCursor?: string;
}

/**
 * wrapping object for the content client request
 *  @member rootId the deliveryId of the root item
 *  @member rootItem (optional) to pass the root item if it has already been fetched
 *  @member maximumDepth (optional)  specifies the maximum depth of the hierarchy query
 *  @member maximumPageSize (optional)  specifies the maximum page size for each page of the hierarchy,
 *  note: maximumDepth and maximumPageSize will not override the limits set by the delivery service.
 */
export interface ContentClientHierarchyRequest {
  rootId: string;
  maximumDepth?: number;
  maximumPageSize?: number;
  rootItem?: ContentItem;
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
