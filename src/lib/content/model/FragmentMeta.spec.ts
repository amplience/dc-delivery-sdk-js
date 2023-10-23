import { expect } from 'chai';
import { FragmentMeta } from './FragmentMeta';

describe('FragmentMeta', () => {
  context('constructor', () => {
    it('should parse inputs', () => {
      const meta = new FragmentMeta({
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
      });

      expect(meta.schema).to.eq(
        'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
      );
    });

    it('should serialize to json', () => {
      const meta = new FragmentMeta({
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
      });

      expect(JSON.parse(JSON.stringify(meta))).to.deep.eq({
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
      });
    });

    it('should attach name if present', () => {
      const meta = new FragmentMeta({
        name: 'Optional',
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
      });

      expect(JSON.parse(JSON.stringify(meta))).to.deep.eq({
        name: 'Optional',
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
      });
    });
  });

  context('isFragment', () => {
    it('should return false if value is null', () => {
      const isFragment = FragmentMeta.isFragment(null);
      expect(isFragment).to.be.false;
    });

    it('should return false if value does not contain _meta', () => {
      const isFragment = FragmentMeta.isFragment({});
      expect(isFragment).to.be.false;
    });

    it('should return false if value does not contain _meta.schema', () => {
      const isFragment = FragmentMeta.isFragment({ _meta: {} });
      expect(isFragment).to.be.false;
    });

    it('should return true if value contains _meta.schema', () => {
      const isFragment = FragmentMeta.isFragment({ _meta: { schema: '' } });
      expect(isFragment).to.be.true;
    });
  });
});
