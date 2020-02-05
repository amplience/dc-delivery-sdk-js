import { AxiosInstance } from 'axios';
import { encodeQueryString } from '../../utils/Url';
import { VseClientConfig } from '../../VseClientConfig';

export class GetSnapshotDomain {
  constructor(
    private readonly config: VseClientConfig,
    private readonly vseClient: AxiosInstance
  ) {}

  getSnapshotDomain(snapshotId: string, timestamp?: number): Promise<string> {
    const url = this.getUrl(snapshotId, timestamp);

    return this.vseClient
      .get<string>(url)
      .then(response => {
        return Promise.resolve(response.data);
      })
      .catch(err => {
        return Promise.reject(
          `An error occurred whilst attempting to get VSE domain for snapshot '${snapshotId}': ${
            err.message
          }`
        );
      });
  }

  getUrl(snapshotId: string, timestamp?: number): string {
    const args = [['snapshotid', snapshotId]];

    if (timestamp !== undefined) {
      args.push(['timestamp', timestamp.toString()]);
    }

    const queryString = encodeQueryString(args);
    return `/domain/${this.config.vseDomain}?${queryString}`;
  }
}
