import { Edition } from '../../content/model/Edition';
import { ContentLifecycle } from '../../content/model/ContentLifecycle';

/**
 * Class representing the response from the [Content Rendering Service](https://docs.amplience.net/integration/contentrenderingservice.html?h=rendering%20service).
 * Rendered content is the output of converting the JSON body of a content item using a template.
 */
export class RenderedContentItem {
  /**
   * Rendered output produced by the template
   */
  body: string;

  /**
   * Metadata related to the edition that published this content item. If the content was not published using
   * an edition this will be undefined.
   */
  edition?: Edition;

  /**
   * Metadata related to the lifecycle status of this content item, by default this is undefined.
   * Business users can flag content to expire at a certain time. If this option is chosen this property
   * will be set with the chosen expiry time.
   */
  lifecycle?: ContentLifecycle;
}
