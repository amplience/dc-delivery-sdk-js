import { expect } from 'chai';
import { Media } from './Media';
import { CommonContentClientConfig } from '../config/CommonContentClientConfig';

const config: CommonContentClientConfig = {};

class MediaImpl extends Media {
  constructor(data: any, config: CommonContentClientConfig) {
    super(data, config);
  }
}

describe('Media', () => {
  context('getHost', () => {
    it('should return the default host', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'cdn.media.amplience.net',
      };

      const media = new MediaImpl(json, config);
      expect(media.getHost(false)).to.eq('cdn.media.amplience.net');
    });

    it('should return the stagingEnvironment host if specified', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'cdn.media.amplience.net',
      };

      const media = new MediaImpl(json, {
        ...config,
        stagingEnvironment: 'staging.bigcontent.io',
      });
      expect(media.getHost(false)).to.eq('staging.bigcontent.io');
    });

    it('should return secureMediaHost if specified', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'cdn.media.amplience.net',
      };

      const media = new MediaImpl(json, {
        ...config,
        secureMediaHost: 'secure.cdn.media.amplience.net',
      });
      expect(media.getHost(true)).to.eq('secure.cdn.media.amplience.net');
    });

    it('should return defaultHost if secure is specified but no secureMediaHost is provided', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'cdn.media.amplience.net',
      };

      const media = new MediaImpl(json, config);
      expect(media.getHost(true)).to.eq('cdn.media.amplience.net');
    });

    it('should return mediaHost if specified and secure is false', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'cdn.media.amplience.net',
      };

      const media = new MediaImpl(json, {
        ...config,
        mediaHost: 'images.mysite.com',
      });
      expect(media.getHost(false)).to.eq('images.mysite.com');
    });

    it('should return secureMediaHost if secure is false and secureMediaHost is specified', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'cdn.media.amplience.net',
      };

      const media = new MediaImpl(json, {
        ...config,
        secureMediaHost: 'secure.cdn.media.amplience.net',
      });
      expect(media.getHost(false)).to.eq('secure.cdn.media.amplience.net');
    });
  });
});
