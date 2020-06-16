import { AxiosInstance, AxiosResponse } from 'axios';
import { encodeQueryString } from '../../utils/Url';
import { RenderedContentItem } from '../model/RenderedContentItem';
import { Edition } from '../../content/model/Edition';
import { ContentLifecycle } from '../../content/model/ContentLifecycle';
import { createContentClient } from '../../client/createContentClient';
import { ContentClientConfigV1 } from '../../config/ContentClientConfigV1';

/**
 * @hidden
 */
export class RenderContentItem {
  private readonly contentClient: AxiosInstance;

  constructor(private readonly config: ContentClientConfigV1) {
    this.contentClient = createContentClient(this.config, 'https://c1.adis.ws');
  }

  renderContentItem(
    contentItemId: string,
    templateName: string,
    customParameters?: { [id: string]: string }
  ): Promise<RenderedContentItem> {
    const queryParameters = this.getQueryParams(templateName, customParameters);
    const queryString = encodeQueryString(queryParameters);
    const path = `/v1/content/${encodeURIComponent(
      this.config.account
    )}/content-item/${encodeURIComponent(contentItemId)}`;
    return this.contentClient.get(`${path}?${queryString}`).then(response => {
      return this.parseResponse(response);
    });
  }

  getQueryParams(
    templateName: string,
    customParameters?: { [id: string]: string }
  ): string[][] {
    const queryParameters = [['template', templateName]];

    if (customParameters) {
      for (const key of Object.keys(customParameters)) {
        const value = customParameters[key];
        queryParameters.push([`crparam.${key}`, value]);
      }
    }

    if (this.config.locale) {
      queryParameters.push(['locale', this.config.locale]);
    }

    return queryParameters;
  }

  parseResponse(response: AxiosResponse): RenderedContentItem {
    const headers = response.headers;

    const result = new RenderedContentItem();
    result.body = response.data;

    if (headers) {
      const editionId = headers['X-Amp-Edition-ID'];
      const editionStart = headers['X-Amp-Edition-Start-Time'];
      const editionEnd = headers['X-Amp-Edition-End-Time'];
      const lifecycleExpiryTime = headers['X-Amp-Lifecycle-Expiry-Time'];

      if (editionId) {
        result.edition = new Edition({
          id: editionId,
          start: editionStart,
          end: editionEnd
        });
      }

      if (lifecycleExpiryTime) {
        result.lifecycle = new ContentLifecycle({
          expiryTime: lifecycleExpiryTime
        });
      }
    }

    return result;
  }
}
