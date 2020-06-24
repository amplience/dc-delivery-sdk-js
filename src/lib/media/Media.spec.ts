import { expect } from 'chai';
import { Media } from './Media';
import { ContentClientConfig } from '../ContentClientConfig';

class MediaImpl extends Media {
  constructor(data: any, config: ContentClientConfig) {
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
        defaultHost: 'i1.adis.ws',
      };

      const media = new MediaImpl(json, { account: 'test' });
      expect(media.getHost(false)).to.eq('i1.adis.ws');
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
        defaultHost: 'i1.adis.ws',
      };

      const media = new MediaImpl(json, {
        account: 'test',
        stagingEnvironment: 'staging.adis.ws',
      });
      expect(media.getHost(false)).to.eq('staging.adis.ws');
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
        defaultHost: 'i1.adis.ws',
      };

      const media = new MediaImpl(json, {
        account: 'test',
        secureMediaHost: 'secure.adis.ws',
      });
      expect(media.getHost(true)).to.eq('secure.adis.ws');
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
        defaultHost: 'i1.adis.ws',
      };

      const media = new MediaImpl(json, { account: 'test' });
      expect(media.getHost(true)).to.eq('i1.adis.ws');
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
        defaultHost: 'i1.adis.ws',
      };

      const media = new MediaImpl(json, {
        account: 'test',
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
        defaultHost: 'i1.adis.ws',
      };

      const media = new MediaImpl(json, {
        account: 'test',
        secureMediaHost: 'secure.adis.ws',
      });
      expect(media.getHost(false)).to.eq('secure.adis.ws');
    });
  });
});
