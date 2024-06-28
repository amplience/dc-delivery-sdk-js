import {
  HierarchyDescendantsRequest,
  HierarchyDescendantsResponse,
} from '../model/HierarchyDescendents';
import { HierarchyDescendantsService } from './HierarchyDescendantsService';
import { AxiosInstance } from 'axios';

export class HierarchyDescendantsById<Body = any> {
  private requestConfig: HierarchyDescendantsRequest = {
    id: '',
  };

  constructor(private readonly contentClient: AxiosInstance) {}

  private readonly hierarchyDescendantsService: HierarchyDescendantsService<
    Body
  > = new HierarchyDescendantsService(this.contentClient);

  descendantsById(id: string): HierarchyDescendantsById {
    this.requestConfig.id = id;
    return this;
  }

  async request(): Promise<HierarchyDescendantsResponse<Body>> {
    return this.hierarchyDescendantsService.get(this.requestConfig);
  }
}
