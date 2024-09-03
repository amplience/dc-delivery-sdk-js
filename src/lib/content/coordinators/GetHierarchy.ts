import { HierarchyContentItem, HierarchyRequest } from '../model/ByHierachy';
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
  /**
   * Retrieve the hierarchy by its root item, then return the root item with its children attached
   * @param request the request data structure providing the rootID and optional parameters for the query
   * @param rootItem the root item's content body so that we can construct the hierarchy
   */
  getHierarchyByRoot(
    request: HierarchyRequest,
    rootItem: ContentItem
  ): Promise<HierarchyContentItem<Body>>;
}
