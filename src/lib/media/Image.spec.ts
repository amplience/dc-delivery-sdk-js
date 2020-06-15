import { expect } from 'chai';
import { Image } from './Image';
import { CommonContentClientConfig } from '../ContentClientConfig';

const config: CommonContentClientConfig = {};

describe('Image', () => {
  context('toJSON', () => {
    it('should serialize to json', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'i1.adis.ws'
      };

      const content = new Image(json, config);
      expect(content.toJSON()).to.deep.eq(json);
    });
  });

  context('url', () => {
    it('should construct a URL to the image resource', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'i1.adis.ws'
      };

      const content = new Image(json, config);
      const url = content.url().build();
      expect(url).to.eq('https://i1.adis.ws/i/test/image');
    });
  });
});
