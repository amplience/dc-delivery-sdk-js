import { HierarchyContentItem, HierarchyRequest } from '../model/ByHierachy';
import { ContentItem } from '../model/ContentItem';
import { ContentBody } from '../model/ContentBody';
import { URL } from 'url';

export class HierarchyURLBuilder {
  static DUMMY_DOMAIN_NAME = 'https://bigcontent.io';
  static HIERARCHY_URL = '/content/hierarchies/descendants/id/';
  static MAXIMUM_DEPTH_PARAM = 'hierarchyDepth';
  static MAXIMUM_PAGE_SIZE_PARAM = 'maxPageSize';
  static LAST_EVALUATED_PARAM = 'pageCursor';

  buildUrl(request: HierarchyRequest): string {
    const url: URL = new URL(
      HierarchyURLBuilder.DUMMY_DOMAIN_NAME +
        HierarchyURLBuilder.HIERARCHY_URL +
        request.rootId
    );
    if (request.maximumDepth != undefined) {
      url.searchParams.append(
        HierarchyURLBuilder.MAXIMUM_DEPTH_PARAM,
        request.maximumDepth.toString()
      );
    }
    if (request.maximumPageSize != undefined) {
      url.searchParams.append(
        HierarchyURLBuilder.MAXIMUM_PAGE_SIZE_PARAM,
        request.maximumPageSize.toString()
      );
    }
    if (request.pageCursor != undefined) {
      url.searchParams.append(
        HierarchyURLBuilder.LAST_EVALUATED_PARAM,
        request.pageCursor
      );
    }
    return url.toString().replace(HierarchyURLBuilder.DUMMY_DOMAIN_NAME, '');
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
