import { expect } from 'chai';
import { ContentItem } from './ContentItem';
import { ContentMeta } from './ContentMeta';

describe('ContentItem', () => {
  context('toJSON', () => {
    it('should serialize to json', () => {
      const content = new ContentItem();
      content.body = {
        _meta: new ContentMeta()
      };

      expect(content.toJSON()).to.deep.eq({
        _meta: {}
      });
    });

    it('should serialize children with custom toJSON implementations', () => {
      const content = new ContentItem();
      content.body = {
        _meta: new ContentMeta(),
        customToJson: {
          toJSON: () => {
            return 'customValue';
          }
        }
      };
      expect(content.toJSON()).to.deep.eq({
        _meta: {},
        customToJson: 'customValue'
      });
    });
  });
});
