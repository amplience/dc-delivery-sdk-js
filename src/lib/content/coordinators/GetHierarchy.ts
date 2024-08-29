import {
  HierachyContentItem,
  HierarchyContentResponse,
  HierarchyRequest,
} from '../model/ByHierachy';
import { ContentItem } from '../model/ContentItem';
import { ContentBody } from '../model/ContentBody';

export class HierarchyURLBuilder {
  static HIERARCHY_URL = '/content/hierarchies/descendants/id/';
  static MAXIMUM_DEPTH_PARAM = 'hierarchyDepth';
  static MAXIMUM_PAGE_SIZE_PARAM = 'maxPageSize';
  static LAST_EVALUATED_PARAM = 'pageCursor';

  buildUrl(request: HierarchyRequest): string {
    let url = HierarchyURLBuilder.HIERARCHY_URL;
    url += request.rootId;
    if (
      request.maximumDepth != undefined ||
      request.maximumPageSize != undefined ||
      request.pageCursor != undefined
    ) {
      url += '?';
      let paramSet = false;
      if (request.maximumDepth != undefined) {
        url +=
          HierarchyURLBuilder.MAXIMUM_DEPTH_PARAM + '=' + request.maximumDepth;
        paramSet = true;
      }

      if (request.maximumPageSize != undefined) {
        if (paramSet) {
          url += '&';
        }
        url +=
          HierarchyURLBuilder.MAXIMUM_PAGE_SIZE_PARAM +
          '=' +
          request.maximumPageSize;
        paramSet = true;
      }
      if (request.pageCursor != undefined) {
        if (paramSet) {
          url += '&';
        }
        url +=
          HierarchyURLBuilder.LAST_EVALUATED_PARAM + '=' + request.pageCursor;
      }
    }
    return url;
  }
}

export interface GetHierarchy<Body extends ContentBody> {
  getHierarchyByRoot(
    request: HierarchyRequest,
    rootItem: ContentItem
  ): Promise<HierachyContentItem<Body>>;
  assembleHierarchy(
    rootItem: ContentItem,
    content: HierarchyContentResponse<Body>[]
  ): Promise<HierachyContentItem<Body>>;
  getByHierarchy(
    request: HierarchyRequest
  ): Promise<HierarchyContentResponse<Body>[]>;
}
