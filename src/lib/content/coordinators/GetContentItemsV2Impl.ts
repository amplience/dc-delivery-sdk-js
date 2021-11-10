import { AxiosInstance } from 'axios';

import { HttpError } from '../model/HttpError';

import { ContentClientConfigV2 } from '../../config';

import { FetchRequest, FetchRequestType, FetchResponse } from '../model/Fetch';

/**
 * Utility that maps an array of ids or keys into the expected format of a `content/fetch` request body
 * @param property id or key
 * @param values array of ids or keys
 * @hidden
 */
function mapToRequests(
  property: FetchRequestType,
  values: Array<any>
): FetchRequest['requests'] {
  if (!Array.isArray(values)) {
    throw new TypeError('Expecting an array');
  }
  return values.map(
    (value: any) =>
      ({ [property]: String(value) } as Record<FetchRequestType, string>)
  );
}

/**
 * Wraps `content/fetch`
 * @hidden
 */
export class GetContentItemsV2Impl {
  constructor(
    private readonly config: ContentClientConfigV2,
    private readonly contentClient: AxiosInstance
  ) {}

  async getContentItemsByKey<Body>(
    keys: Array<string>
  ): Promise<FetchResponse<Body>> {
    return this.getContentItems(mapToRequests('key', keys));
  }

  async getContentItemsById<Body>(
    ids: Array<string>
  ): Promise<FetchResponse<Body>> {
    return this.getContentItems(mapToRequests('id', ids));
  }

  async getContentItems<Body>(
    requests: FetchRequest['requests'],
    parameters?: FetchRequest['parameters']
  ): Promise<FetchResponse<Body>> {
    return this.fetchContentItems({
      parameters,
      requests,
    });
  }

  async fetchContentItems<Body>({
    requests,
    parameters,
  }: FetchRequest): Promise<FetchResponse<Body>> {
    const defaultParameters: FetchRequest['parameters'] = {
      depth: 'all',
      format: 'inlined',
    };

    if (this.config.locale) {
      defaultParameters.locale = this.config.locale;
    }

    const mergedParameters = {
      ...defaultParameters,
      ...(parameters || {}),
    };

    try {
      const { data } = await this.contentClient.post('content/fetch', {
        parameters: mergedParameters,
        requests,
      });
      return data;
    } catch (err) {
      if (err.response) {
        throw new HttpError(err.response.status, err.response.data);
      }
      throw err;
    }
  }
}
