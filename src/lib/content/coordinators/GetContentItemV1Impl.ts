import { AxiosInstance } from 'axios';
import { encodeQueryString } from '../../utils/Url';
import { walkAndReplace } from '../../utils/JsonWalker';
import { ContentItem } from '../model/ContentItem';
import { ContentBody } from '../model/ContentBody';
import { ContentMapper } from '../mapper/ContentMapper';
import { createContentClient } from '../../client/createContentClient';
import { GetContentItemById } from './GetContentItemById';
import { ContentClientConfigV1 } from '../../config/ContentClientConfigV1';

/**
 * @hidden
 */
const LD_ID = '@id';

/**
 * @hidden
 */
const LD_TYPE = '@type';

/**
 * @hidden
 */
const LD_GRAPH = '@graph';

/**
 * @hidden
 */
export class GetContentItemV1Impl implements GetContentItemById {
  private readonly contentClient: AxiosInstance;

  constructor(
    private readonly config: ContentClientConfigV1,
    private readonly mapper: ContentMapper
  ) {
    this.contentClient = createContentClient(this.config, 'https://c1.adis.ws');
  }

  /**
   * @deprecated use getContentItemById
   */
  getContentItem<T extends ContentBody>(id: string): Promise<ContentItem<T>> {
    return this.getContentItemById(id);
  }

  getContentItemById<T extends ContentBody>(
    id: string
  ): Promise<ContentItem<T>> {
    const url = this.getUrl({
      'sys.iri': `http://content.cms.amplience.com/${id}`,
    });

    return this.contentClient.get(url).then((response) => {
      const contentItems = this.processResponse(response.data);

      if (contentItems.length === 0) {
        return Promise.reject(`Content item "${id}" was not found`);
      }

      const item = contentItems.find((x) => x._meta.deliveryId === id);
      if (!item) {
        return Promise.reject(`Content item "${id}" was not found`);
      }

      return Promise.resolve(this.hydrateContentItem<T>(item));
    });
  }

  getUrl(query: any): string {
    const args = [
      ['query', JSON.stringify(query)],
      ['fullBodyObject', 'true'],
      ['scope', 'tree'],
      ['store', this.config.account],
    ];
    if (this.config.locale) {
      args.push(['locale', this.config.locale]);
    }
    const queryString = encodeQueryString(args);
    return `/cms/content/query?${queryString}`;
  }

  /**
   * Convert plain content JSON into ContentItem instamce
   * @param content
   */
  hydrateContentItem<T extends ContentBody>(content: any): ContentItem<T> {
    const contentItem = new ContentItem<T>();
    contentItem.body = this.mapper.toMappedContent(content);
    return contentItem;
  }

  /**
   * Pre-processes the response to create a single content item object
   * with all linked content items inlined.
   * @param data Response from content query API
   */
  processResponse(data: any): any[] {
    if (!data.result || !data[LD_GRAPH] || !Array.isArray(data.result)) {
      return [];
    } else {
      const graph = data[LD_GRAPH];
      const graphChildrenById = {};
      graph.forEach((child) => (graphChildrenById[child[LD_ID]] = child));

      return data.result.map((result) => {
        result = graphChildrenById[result[LD_ID]];

        // inline linked items
        result = walkAndReplace(result, {
          beforeWalk: (node) => {
            if (typeof node === 'object') {
              if (node[LD_ID]) {
                node = graphChildrenById[node[LD_ID]];
              }
            }
            return node;
          },
        });

        // upgrade legacy content & remove json-ld
        result = walkAndReplace(result, {
          beforeWalk: (node) => {
            node = this.upgradeLegacyContent(node);
            node = this.injectMetaData(node);
            node = this.removeJsonLD(node);
            return node;
          },
        });

        return result;
      });
    }
  }

  /**
   * Content produced by older versions do not include _meta.schema.
   * This function inserts those values to normalize the output
   */
  upgradeLegacyContent(node: any): any {
    if (!node) {
      return node;
    }

    const type = node[LD_TYPE];
    const id = node[LD_ID];
    const isImage = id && id.indexOf('http://image.cms.amplience.com/') === 0;
    const isVideo = id && id.indexOf('http://video.cms.amplience.com/') === 0;

    if (type || isImage || isVideo) {
      if (!node._meta) {
        node._meta = {};
      }

      if (type) {
        if (!node._meta.schema) {
          node._meta.schema = type;
        }
        if (!node._meta.name && node._title) {
          node._meta.name = node._title;
        }
      } else if (isImage) {
        node._meta.schema =
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link';
      } else if (isVideo) {
        node._meta.schema =
          'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link';
      }
    }

    return node;
  }

  /**
   * Injects additional meta data which is lost by removing
   * the JSON-LD properties
   */
  injectMetaData(node: any): any {
    if (node) {
      const id = node[LD_ID];
      if (id) {
        if (id.indexOf('http://content.cms.amplience.com/') === 0) {
          node._meta = node._meta || {};
          node._meta.deliveryId = id.slice(33);
        } else if (
          id.indexOf('http://image.cms.amplience.com/') === 0 ||
          id.indexOf('http://video.cms.amplience.com/') === 0
        ) {
          node.id = id.slice(31);
        }
      }
    }
    return node;
  }

  /**
   * JSON-LD keywords are just for delivery payload
   */
  removeJsonLD(node: any): any {
    if (node) {
      delete node[LD_TYPE];
      delete node[LD_ID];
    }
    return node;
  }
}
