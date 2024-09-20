import { HierarchyAssembler, isParent } from './HierarchyAssembler';
import { ContentBody } from '../model/ContentBody';
import {
  HierarchyContentItem,
  HierarchyContentResponse,
} from '../model/ByHierachy';
import { ContentItem } from '../model/ContentItem';

export class MutatingHierachyAssemblerImpl<Body extends ContentBody>
  implements HierarchyAssembler<Body> {
  constructor(
    private readonly mutationFunction: (content: ContentBody) => ContentBody
  ) {}
  assembleChildren(
    rootItem: HierarchyContentItem<Body>,
    content: HierarchyContentResponse<Body>[]
  ): void {
    rootItem.children.push(
      ...content
        .filter((contentItem) => {
          return isParent(rootItem.content, contentItem.content);
        })
        .map((item) => {
          const hierarchyItem: HierarchyContentItem<any> = {
            content: this.mutationFunction(item.content),
            children: [],
          };
          this.assembleChildren(hierarchyItem, content);
          return hierarchyItem;
        })
    );
  }

  assembleRoot(
    rootItem: ContentItem<Body>,
    content: HierarchyContentResponse<Body>[]
  ): HierarchyContentItem<Body> {
    const rootHierarchyItem: HierarchyContentItem<Body> = {
      content: rootItem.body,
      children: [],
    };
    rootHierarchyItem.children = content
      .filter((contentItem) => {
        return isParent(rootItem.body, contentItem.content);
      })
      .map((item) => {
        const hierarchyItem: HierarchyContentItem<Body> = {
          content: this.mutationFunction(item.content),
          children: [],
        };
        this.assembleChildren(hierarchyItem, content);
        return hierarchyItem;
      });

    return rootHierarchyItem;
  }
}
