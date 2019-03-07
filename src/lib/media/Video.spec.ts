import { expect } from 'chai';
import { Video } from './Video';

describe('Video', () => {
  context('toJSON', () => {
    it('should serialize to json', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link'
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'video',
        endpoint: 'test',
        defaultHost: 'i1.adis.ws'
      };

      const content = new Video(json, { account: 'test' });
      expect(content.toJSON()).to.deep.eq(json);
    });
  });

  context('thumbnail', () => {
    it('should construct a URL to the video thumbnail', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link'
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'image',
        endpoint: 'test',
        defaultHost: 'i1.adis.ws'
      };

      const content = new Video(json, { account: 'test' });
      const url = content.thumbnail().build();
      expect(url).to.eq('https://i1.adis.ws/v/test/image');
    });
  });
});
