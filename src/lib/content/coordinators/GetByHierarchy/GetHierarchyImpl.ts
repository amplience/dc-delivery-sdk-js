import { AxiosInstance } from 'axios';
import { GetHierarchy } from './GetHierarchy';
import {
  HierarchyContentItem,
  HierarchyContentResponse,
  HierarchyRequest,
  HierarchyResponse,
} from '../../model/ByHierachy';
import { HttpError } from '../../model/HttpError';
import { ContentItem } from '../../model/ContentItem';
import { ContentBody } from '../../model/ContentBody';
import { HierarchyAssembler } from './assemblers/HierarchyAssembler';
import { HierarchyURLBuilder } from './UrlBuilder';

export class GetHierarchyImpl<Body extends ContentBody>
  implements GetHierarchy<Body> {
  private readonly hierarchyUrlBuilder: HierarchyURLBuilder;

  constructor(
    private readonly contentClient: AxiosInstance,
    private readonly assembler: HierarchyAssembler<Body>
  ) {
    this.hierarchyUrlBuilder = new HierarchyURLBuilder();
  }

  private async getByHierarchy(
    request: HierarchyRequest
  ): Promise<HierarchyContentResponse<Body>[]> {
    const content: HierarchyContentResponse<Body>[] = [];
    try {
      const { data } = await this.contentClient.get<HierarchyResponse<Body>>(
        this.hierarchyUrlBuilder.buildUrl(request)
      );

      content.push(...data.responses);
      if (data.page.cursor != undefined) {
        request.pageCursor = data.page.cursor;
        content.push(...(await this.getByHierarchy(request)));
      }
      return content;
    } catch (err) {
      if (err.response) {
        throw new HttpError(err.response.status, err.response.data);
      }

      throw err;
    }
  }

  async getHierarchyByRoot(
    request: HierarchyRequest,
    rootItem: ContentItem
  ): Promise<HierarchyContentItem<Body>> {
    const hierarchyData = await this.getByHierarchy(request);
    const rootHierarchyItem = this.assembler.assembleRoot(
      rootItem,
      hierarchyData
    );
    return rootHierarchyItem;
  }
}
