import { HierarchyAssembler, isParent } from './HierarchyAssembler';
import { ContentBody } from '../../../model/ContentBody';
import {
  HierarchyContentItem,
  HierarchyContentResponse,
} from '../../../model/ByHierachy';
import { ContentItem } from '../../../model/ContentItem';

export class FilteringAndMutatingHierarchyAssembler<Body extends ContentBody>
  implements HierarchyAssembler<Body> {
  constructor(
    private readonly filterFunction: (content: Body) => boolean,
    private readonly mutationFunction: (content: Body) => Body
  ) {}
  assembleChildren(
    rootItem: HierarchyContentItem<Body>,
    content: HierarchyContentResponse<Body>[]
  ): void {
    rootItem.children.push(
      ...content
        .filter((contentItem) => {
          return (
            isParent(rootItem.content, contentItem.content) &&
            !this.filterFunction(contentItem.content)
          );
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
      content: this.mutationFunction(rootItem.body),
      children: [],
    };
    rootHierarchyItem.children = content
      .filter((contentItem) => {
        return (
          isParent(rootItem.body, contentItem.content) &&
          !this.filterFunction(contentItem.content)
        );
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
