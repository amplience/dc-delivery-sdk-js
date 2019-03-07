import { ContentMeta } from './ContentMeta';

/**
 * @hidden
 */
export interface DefaultContentBody extends ContentBody {
  [key: string]: any;
}

/**
 * JSON body of a Content Item. This object will contain the fields specified by the
 * JSON schema content type.
 */
export interface ContentBody {
  /**
   * Metadata about the ContentItem.
   */
  _meta: ContentMeta;
}
