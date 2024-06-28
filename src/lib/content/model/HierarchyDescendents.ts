import { IHierarchyChildContentMeta } from './ContentMeta';
import { ContentBody } from './ContentBody';

export interface HierarchyDescendantsRequest {
  id: string;
  pageSize?: number;
}

export interface IHierarchyPageResponse<Body> {
  responseCount: number;
  nextCursor?: string;
  next?: () => Promise<HierarchyDescendantsResponse<Body>>;
}

export interface HierarchyContentItemResponse<Body = any> {
  content: Body &
    ContentBody & {
      _meta: IHierarchyChildContentMeta;
    };
}

export interface HierarchyRootNode<Body> {
  children?: HierarchyNode<Body>[];
  findById: (id: string) => HierarchyNode<Body> | undefined;
}

export interface HierarchyNode<Body> {
  content: Body &
    ContentBody & {
      _meta: IHierarchyChildContentMeta;
    };
  children?: HierarchyNode<Body>[];
}

export interface HierarchyDescendantsResponse<Body> {
  responses: HierarchyContentItemResponse<Body>[];
  page: IHierarchyPageResponse<Body>;
  asTree: () => HierarchyRootNode<Body>;
}
