import { FragmentMeta } from '../content/model/FragmentMeta';

/**
 * Class providing meta data about a Media resource.
 */
export abstract class MediaMeta extends FragmentMeta {
  constructor(data?: Record<string, any>) {
    super(data);
  }
}

/**
 * Class providing meta data about an Image resource.
 */
export class ImageMeta extends MediaMeta {
  constructor(data?: Record<string, any>) {
    super(data);
  }
}

/**
 * Class providing meta data about a Video resource.
 */
export class VideoMeta extends MediaMeta {
  constructor(data?: Record<string, any>) {
    super(data);
  }
}
