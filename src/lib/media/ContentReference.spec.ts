import { expect } from 'chai';
import { ContentReference } from './ContentReference';

describe('Content Reference', () => {
  context('toJSON', () => {
    it('should serialize to json', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference'
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'content ref'
      };

      const content = new ContentReference(json, { account: 'test' });
      expect(content.toJSON()).to.deep.eq(json);
    });

    it('should attach contentType if present', () => {
      const json = {
        _meta: {
          schema:
            'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference'
        },
        id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
        name: 'content ref',
        contentType: 'http://some-content-type.com/type.json'
      };

      const content = new ContentReference(json, { account: 'test' });
      expect(content.toJSON()).to.deep.eq(json); 
    });
  });
});
