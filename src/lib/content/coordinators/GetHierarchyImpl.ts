import { AxiosInstance } from 'axios';
import { GetHierarchy, HierarchyURLBuilder } from './GetHierarchy';
import {
  HierachyContentItem,
  HierarchyContentResponse,
  HierarchyRequest,
  HierarchyResponse,
} from '../model/ByHierachy';
import { HttpError } from '../model/HttpError';
import { ContentItem } from '../model/ContentItem';
import { ContentBody } from '../model/ContentBody';

export class GetHierarchyImpl<Body extends ContentBody>
  implements GetHierarchy<Body> {
  private readonly hierarchyUrlBuilder: HierarchyURLBuilder;

  constructor(private readonly contentClient: AxiosInstance) {
    this.hierarchyUrlBuilder = new HierarchyURLBuilder();
  }

  async getByHierarchy(
    request: HierarchyRequest
  ): Promise<HierarchyContentResponse<Body>[]> {
    const content: HierarchyContentResponse<Body>[] = [];
    try {
      const { data } = await this.contentClient.get<HierarchyResponse<Body>>(
        this.hierarchyUrlBuilder.buildUrl(request)
      );

      content.push(...data.responses);
      if (data.page.nextCursor != undefined) {
        request.lastEvalKey = data.page.nextCursor;
        content.push(...(await this.getByHierarchy(request)));
      }
      return new Promise((resolve) => {
        resolve(content);
      });
    } catch (err) {
      if (err.response) {
        throw new HttpError(err.response.status, err.response.data);
      }

      throw err;
    }
  }

  assembleHierarchy(
    rootItem: ContentItem,
    content: HierarchyContentResponse<Body>[]
  ): Promise<HierachyContentItem<Body>> {
    const rootHierarchyItem: HierachyContentItem<Body> = {
      content: rootItem.body,
      children: [],
    };
    rootHierarchyItem.children = content
      .filter((contentItem) => {
        return this.isParent(rootItem.body, contentItem.content);
      })
      .map((item) => {
        const hierarchyItem: HierachyContentItem<Body> = {
          content: item.content,
          children: [],
        };
        this.assembleChildren(hierarchyItem, content);
        return hierarchyItem;
      });

    return new Promise((resolve) => {
      resolve(rootHierarchyItem);
    });
  }

  assembleChildren(
    rootItem: HierachyContentItem<Body>,
    content: HierarchyContentResponse<Body>[]
  ): void {
    rootItem.children.push(
      ...content
        .filter((contentItem) => {
          return this.isParent(rootItem.content, contentItem.content);
        })
        .map((item) => {
          const hierarchyItem: HierachyContentItem<any> = {
            content: item.content,
            children: [],
          };
          this.assembleChildren(hierarchyItem, content);
          return hierarchyItem;
        })
    );
  }

  async getHierarchyByRoot(
    request: HierarchyRequest,
    rootItem: ContentItem
  ): Promise<HierachyContentItem<Body>> {
    const hierarchyData = await this.getByHierarchy(request);
    const rootHierarchyItem = await this.assembleHierarchy(
      rootItem,
      hierarchyData
    );
    return new Promise((resolve) => {
      resolve(rootHierarchyItem);
    });
  }

  private isParent(rootHierarchyItem: ContentBody, contentItem: ContentBody) {
    return (
      contentItem._meta.hierarchy != undefined &&
      contentItem._meta.hierarchy.parentId != undefined &&
      contentItem._meta.hierarchy.parentId == rootHierarchyItem._meta.deliveryId
    );
  }
}
