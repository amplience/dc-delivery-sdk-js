import { expect } from 'chai';
import { ContentMeta } from './ContentMeta';

describe('ContentMeta', () => {
  context('constructor', () => {
    it('should parse inputs', () => {
      const meta = new ContentMeta({
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        name: 'Homepage Body',
        edition: {
          id: '5b1a621ac9e77c0001b121b4',
          start: '2018-06-30T23:00:00.000Z',
          end: '2018-07-06T22:59:59.999Z'
        },
        lifecycle: {
          expiryTime: '2018-07-06T22:59:59.999Z'
        }
      });

      expect(meta.schema).to.eq(
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
      );
    });

    it('should serialize to json', () => {
      const meta = new ContentMeta({
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        name: 'Homepage Body',
        edition: {
          id: '5b1a621ac9e77c0001b121b4',
          start: '2018-06-30T23:00:00.000Z',
          end: '2018-07-06T22:59:59.999Z'
        },
        lifecycle: {
          expiryTime: '2018-07-06T22:59:59.999Z'
        }
      });

      expect(meta.toJSON()).to.deep.eq({
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        name: 'Homepage Body',
        edition: {
          id: '5b1a621ac9e77c0001b121b4',
          start: '2018-06-30T23:00:00.000Z',
          end: '2018-07-06T22:59:59.999Z'
        },
        lifecycle: {
          expiryTime: '2018-07-06T22:59:59.999Z'
        }
      });
    });
  });
});
