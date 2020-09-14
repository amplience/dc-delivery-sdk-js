import { expect } from 'chai';
import { ContentMeta } from './ContentMeta';

describe('ContentMeta', () => {
  context('constructor', () => {
    it('should parse inputs', () => {
      const meta = new ContentMeta({
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        name: 'Homepage Body',
        deliveryId: '00112233-4455-6677-8899-aabbccddeeff',
        deliveryKey: 'homepage/body',
        edition: {
          id: '5b1a621ac9e77c0001b121b4',
          start: '2018-06-30T23:00:00.000Z',
          end: '2018-07-06T22:59:59.999Z',
        },
        lifecycle: {
          expiryTime: '2018-07-06T22:59:59.999Z',
        },
        hierarchy: {
          parentId: 'e72ec600-2975-4c6a-80dd-3f55981cd254',
          root: false,
        },
      });

      expect(meta.schema).to.eq(
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
      );
      expect(meta.name).to.eq('Homepage Body');
      expect(meta.deliveryId).to.eq('00112233-4455-6677-8899-aabbccddeeff');
      expect(meta.deliveryKey).to.eq('homepage/body');
      expect(meta.edition.id).to.eq('5b1a621ac9e77c0001b121b4');
      expect(meta.edition.start).to.eq('2018-06-30T23:00:00.000Z');
      expect(meta.edition.end).to.eq('2018-07-06T22:59:59.999Z');
      expect(meta.lifecycle.expiryTime).to.eq('2018-07-06T22:59:59.999Z');
      expect(meta.hierarchy.root).to.eq(false);
    });

    it('should serialize to json', () => {
      const meta = new ContentMeta({
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        name: 'Homepage Body',
        deliveryId: '00112233-4455-6677-8899-aabbccddeeff',
        deliveryKey: 'homepage/body',
        edition: {
          id: '5b1a621ac9e77c0001b121b4',
          start: '2018-06-30T23:00:00.000Z',
          end: '2018-07-06T22:59:59.999Z',
        },
        lifecycle: {
          expiryTime: '2018-07-06T22:59:59.999Z',
        },
        hierarchy: {
          parentId: 'e72ec600-2975-4c6a-80dd-3f55981cd254',
          root: false,
        },
      });

      expect(meta.toJSON()).to.deep.eq({
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        name: 'Homepage Body',
        deliveryId: '00112233-4455-6677-8899-aabbccddeeff',
        deliveryKey: 'homepage/body',
        edition: {
          id: '5b1a621ac9e77c0001b121b4',
          start: '2018-06-30T23:00:00.000Z',
          end: '2018-07-06T22:59:59.999Z',
        },
        lifecycle: {
          expiryTime: '2018-07-06T22:59:59.999Z',
        },
        hierarchy: {
          parentId: 'e72ec600-2975-4c6a-80dd-3f55981cd254',
          root: false,
        },
      });
    });
  });
});
