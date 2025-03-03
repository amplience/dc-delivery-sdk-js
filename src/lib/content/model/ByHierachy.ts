import { IContentMeta } from './ContentMeta';
import { ContentBody } from './ContentBody';
import { ContentItem } from './ContentItem';
import {RequestType, IOrder} from './FilterBy';



export interface HierarchyRequest {
  rootId: string;
  deliveryType: RequestType;
  maximumDepth?: number;
  maximumPageSize?: number;
  pageCursor?: string;
  sortKey?: string;
  sortOrder?: IOrder;
}

/**
 * wrapping object for the content client request
 *  @member rootId the deliveryId of the root item
 *  @member rootItem (optional) to pass the root item if it has already been fetched
 *  @member maximumDepth (optional)  specifies the maximum depth of the hierarchy query
 *  @member maximumPageSize (optional)  specifies the maximum page size for each page of the hierarchy,
 *  @member sortOrder (optional) specifies the sort the service should use when retrieving content from the database
 *  @member sortKey (optional) specifies the name of the sort parameter used to retrieve content, this can effect what content is returned
 *  note: maximumDepth and maximumPageSize will not override the limits set by the delivery service.
 */
export interface ContentClientHierarchyRequest {
  rootId: string;
  maximumDepth?: number;
  maximumPageSize?: number;
  rootItem?: ContentItem;
  sortKey?: string;
  sortOrder?: IOrder;
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
