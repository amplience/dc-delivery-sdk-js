import { expect } from 'chai';
import { ContentMapper } from './ContentMapper';
import { ContentMeta } from '../model/ContentMeta';
import { Image } from '../../media/Image';
import { Video } from '../../media/Video';
import {
  ContentReference,
  ContentReferenceMeta,
} from '../model/ContentReference';
import { CommonContentClientConfig } from '../../config/CommonContentClientConfig';

const config: CommonContentClientConfig = {};

describe('ContentMapper', () => {
  context('map', () => {
    it('should return original json', () => {
      const mapper = new ContentMapper(config);
      const result = mapper.toMappedContent({
        key: 'value',
      });

      expect(result).to.deep.eq({
        key: 'value',
      });
    });

    it('should invoke custom mappers', () => {
      const mapper = new ContentMapper(config);

      let mapperInvocations = 0;
      mapper.addCustomMapper(() => {
        mapperInvocations++;
      });

      mapper.toMappedContent({
        _meta: {
          schema: 'schema.json',
        },
      });

      expect(mapperInvocations).to.eq(1);
    });

    it('should skip custom mappers that return nothing', () => {
      const mapper = new ContentMapper(config);

      mapper.addCustomMapper(() => {});

      const result = mapper.toMappedContent({
        _meta: {
          schema: 'schema.json',
        },
      });

      expect(result).to.deep.eq({
        _meta: {
          schema: 'schema.json',
        },
      });
    });

    it('should replace nodes with value returned from custom mappers', () => {
      const mapper = new ContentMapper(config);

      mapper.addCustomMapper(() => {
        return {};
      });

      const result = mapper.toMappedContent({
        _meta: {
          schema: 'schema.json',
        },
      });

      expect(result).to.deep.eq({});
    });

    it('should replace nested nodes', () => {
      const mapper = new ContentMapper(config);

      mapper.addCustomMapper((fragment) => {
        if (fragment._meta.schema === 'customType.json') {
          return {
            ...fragment,
            injectedKey: 'value',
          };
        }
      });

      const result = mapper.toMappedContent({
        _meta: {
          schema: 'schema.json',
        },
        customType: {
          _meta: {
            schema: 'customType.json',
          },
        },
      });

      expect(result).to.deep.eq({
        _meta: {
          schema: 'schema.json',
        },
        customType: {
          _meta: {
            schema: 'customType.json',
          },
          injectedKey: 'value',
        },
      });
    });
  });

  context('addSchema', () => {
    it('should replace values with matching schemaId', () => {
      const mapper = new ContentMapper(config);
      mapper.addSchema('customType.json', () => 'replaced');

      const result = mapper.toMappedContent({
        customType: {
          _meta: {
            schema: 'customType.json',
          },
        },
      });

      expect(result).to.deep.eq({
        customType: 'replaced',
      });
    });

    it('should replace values where schema matches regex', () => {
      const mapper = new ContentMapper(config);
      mapper.addSchema(/.*\.json/, () => 'replaced');

      const result = mapper.toMappedContent({
        customType: {
          _meta: {
            schema: 'customType.json',
          },
        },
      });

      expect(result).to.deep.eq({
        customType: 'replaced',
      });
    });
  });

  context('convertContentMeta', () => {
    it('should convert content item meta data', () => {
      const mapper = new ContentMapper(config);
      const result = mapper.toMappedContent({
        _meta: {
          name: 'page',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
      });

      expect(result._meta).to.be.instanceOf(ContentMeta);
    });
  });

  context('convertContentReference', () => {
    it('should convert content reference meta data', () => {
      const mapper = new ContentMapper(config);
      const result = mapper.toMappedContent({
        _meta: {
          name: 'content reference',
          id: '123',
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference',
        },
      });

      expect(result._meta).to.be.instanceOf(ContentReferenceMeta);
      expect(result).to.be.instanceOf(ContentReference);
    });
  });

  context('convertImage', () => {
    it('should convert image-link', () => {
      const mapper = new ContentMapper(config);
      const result = mapper.toMappedContent({
        image: {
          _meta: {
            schema:
              'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
          },
          id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
      });
      expect(result.image).to.be.instanceOf(Image);
    });

    context('convertVideo', () => {
      it('should convert video-link', () => {
        const mapper = new ContentMapper(config);
        const result = mapper.toMappedContent({
          image: {
            _meta: {
              schema:
                'http://bigcontent.io/cms/schema/v1/core#/definitions/video-link',
            },
            id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
            name: 'image',
            endpoint: 'test',
            defaultHost: 'cdn.media.amplience.net',
          },
        });
        expect(result.image).to.be.instanceOf(Video);
      });
    });
  });
});
