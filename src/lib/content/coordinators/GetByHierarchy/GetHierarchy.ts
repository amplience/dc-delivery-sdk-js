import { HierarchyContentItem, HierarchyRequest } from '../../model/ByHierachy';
import { ContentItem } from '../../model/ContentItem';
import { ContentBody } from '../../model/ContentBody';

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
