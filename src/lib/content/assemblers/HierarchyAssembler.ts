import {
  HierarchyContentItem,
  HierarchyContentResponse,
} from '../model/ByHierachy';
import { ContentBody } from '../model/ContentBody';
import { ContentItem } from '../model/ContentItem';

export function isParent(
  rootHierarchyItem: ContentBody,
  contentItem: ContentBody
): boolean {
  return (
    contentItem._meta.hierarchy != undefined &&
    contentItem._meta.hierarchy.parentId != undefined &&
    contentItem._meta.hierarchy.parentId == rootHierarchyItem._meta.deliveryId
  );
}

export interface HierarchyAssembler<Body extends ContentBody> {
  assembleRoot(
    rootItem: ContentItem,
    content: HierarchyContentResponse<Body>[]
  ): HierarchyContentItem<Body>;
  assembleChildren(
    rootItem: HierarchyContentItem<Body>,
    content: HierarchyContentResponse<Body>[]
  ): void;
}
