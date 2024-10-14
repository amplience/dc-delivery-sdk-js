import { HierarchyRequest } from '../../model/ByHierachy';
import { encodeQueryString } from '../../../utils/Url';

export class HierarchyURLBuilder {
  static HIERARCHY_URL = '/content/hierarchies/descendants/id/';
  static MAXIMUM_DEPTH_PARAM = 'hierarchyDepth';
  static MAXIMUM_PAGE_SIZE_PARAM = 'maxPageSize';
  static LAST_EVALUATED_PARAM = 'pageCursor';

  buildUrl(request: HierarchyRequest): string {
    const params: string[][] = [];

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
    if (params.length > 0) {
      return `${HierarchyURLBuilder.HIERARCHY_URL}${
        request.rootId
      }?${encodeQueryString(params)}`;
    } else {
      return HierarchyURLBuilder.HIERARCHY_URL + request.rootId;
    }
  }
}
