import { ContentBody } from '../../../model/ContentBody';
import { HierarchyAssembler, isParent } from './HierarchyAssembler';
import {
  HierarchyContentItem,
  HierarchyContentResponse,
} from '../../../model/ByHierachy';
import { ContentItem } from '../../../model/ContentItem';

export class HierarchyAssemblerImpl<Body extends ContentBody>
  implements HierarchyAssembler<Body> {
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
            content: item.content,
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
      content: rootItem.toJSON(),
      children: [],
    };
    rootHierarchyItem.children = content
      .filter((contentItem) => {
        return isParent(rootItem.body, contentItem.content);
      })
      .map((item) => {
        const hierarchyItem: HierarchyContentItem<Body> = {
          content: item.content,
          children: [],
        };
        this.assembleChildren(hierarchyItem, content);
        return hierarchyItem;
      });

    return rootHierarchyItem;
  }
}
