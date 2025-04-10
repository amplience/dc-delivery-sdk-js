import { HierarchyRequest } from '../../model/ByHierachy';
import { encodeQueryString } from '../../../utils/Url';

export class HierarchyURLBuilder {
  static HIERARCHY_URL_BASE = '/content/hierarchies/descendants/';
  static MAXIMUM_DEPTH_PARAM = 'hierarchyDepth';
  static MAXIMUM_PAGE_SIZE_PARAM = 'maxPageSize';
  static LAST_EVALUATED_PARAM = 'pageCursor';
  static SORT_KEY_PARAM = 'sortByKey';
  static SORT_ORDER_PARAM = 'sortByOrder';
  buildUrl(request: HierarchyRequest): string {
    const params: string[][] = [];
    const requestType = request.deliveryType + '/';

    if (request.maximumDepth !== undefined) {
      params.push([
        HierarchyURLBuilder.MAXIMUM_DEPTH_PARAM,
        request.maximumDepth.toString(),
      ]);
    }
    if (request.maximumPageSize !== undefined) {
      params.push([
        HierarchyURLBuilder.MAXIMUM_PAGE_SIZE_PARAM,
        request.maximumPageSize.toString(),
      ]);
    }
    if (request.pageCursor !== undefined) {
      params.push([
        HierarchyURLBuilder.LAST_EVALUATED_PARAM,
        request.pageCursor.toString(),
      ]);
    }
    if (request.sortKey !== undefined) {
      params.push([HierarchyURLBuilder.SORT_KEY_PARAM, request.sortKey]);
    }
    if (request.sortOrder !== undefined) {
      params.push([HierarchyURLBuilder.SORT_ORDER_PARAM, request.sortOrder]);
    }
    let url =
      HierarchyURLBuilder.HIERARCHY_URL_BASE + requestType + request.rootId;
    if (params.length > 0) {
      url += `?${encodeQueryString(params)}`;
    }
    return url;
  }
}
