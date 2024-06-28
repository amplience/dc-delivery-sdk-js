import { AxiosInstance } from 'axios';
import { HttpError } from '../model/HttpError';
import {
  HierarchyDescendantsResponse,
  HierarchyDescendantsRequest,
  HierarchyNode,
  HierarchyRootNode,
} from '../model/HierarchyDescendents';

export class HierarchyDescendantsService<Body = any> {
  constructor(private readonly contentClient: AxiosInstance) {}

  async get(
    request: HierarchyDescendantsRequest
  ): Promise<HierarchyDescendantsResponse<Body>> {
    try {
      const { data } = await this.contentClient.get<
        HierarchyDescendantsResponse<Body>
      >('content/hierarchies/descendants/id/' + request.id);

      return {
        ...data,
        asTree: () => descendantsResponseToTree(request.id, data),
      };
    } catch (err) {
      if (err.response) {
        throw new HttpError(err.response.status, err.response.data);
      }

      throw err;
    }
  }
}

function descendantsResponseToTree<Body>(
  rootItemId: string,
  result: HierarchyDescendantsResponse<Body>
): HierarchyRootNode<Body> {
  const nodeMap: Map<string, HierarchyNode<Body>> = new Map();

  result.responses.forEach(({ content }) => {
    nodeMap.set(content._meta.deliveryId, { content, children: [] });
  });

  const topLevelChildren: HierarchyNode<Body>[] = [];

  result.responses.forEach(({ content }) => {
    const parentId = content._meta.hierarchy.parentId;
    const node = nodeMap.get(content._meta.deliveryId);

    if (parentId === rootItemId) {
      topLevelChildren.push(node);
    } else {
      nodeMap.get(parentId)?.children?.push(node);
    }
  });

  const findById = (id: string): HierarchyNode<Body> => {
    return nodeMap.get(id);
  };

  return { children: topLevelChildren, findById };
}
