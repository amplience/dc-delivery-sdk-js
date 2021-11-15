import { expect } from 'chai';
import { ContentClient } from '../index';
import MockAdapter from 'axios-mock-adapter';
import * as V1_SINGLE_RESULT from './content/coordinators/__fixtures__/v1/SINGLE_RESULT.json';
import * as V2_SINGLE_RESULT from './content/coordinators/__fixtures__/v2/SINGLE_RESULT.json';
import * as NO_RESULTS from './content/coordinators/__fixtures__/v2/filterBy/NO_RESULTS.json';
import { ContentClientConfigV1 } from './config/ContentClientConfigV1';
import { FilterBy } from './content/coordinators/FilterBy';

const SINGLE_ITEM_RESPONSE = {
  _meta: {
    deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
    name: 'name',
    schema:
      'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
  },
  string: 'value',
  number: 123,
  bool: true,
  null: null,
  object: {
    string: 'value',
    number: 123,
    bool: true,
    null: null,
  },
  array: [
    {
      object: {
        string: 'value',
        number: 123,
        bool: true,
        null: null,
      },
    },
  ],
};

describe('ContentClient', () => {
  context('configuration', () => {
    it('should throw if config is not provided', () => {
      expect(() => new ContentClient(null)).to.throw(
        'Parameter "config" is required'
      );
    });

    it('should throw if config.account is not provided', () => {
      expect(
        () => new ContentClient(({} as unknown) as ContentClientConfigV1)
      ).to.throw('Parameter "config" must contain a valid "account" name');
    });

    it('should throw if config.stagingEnvironment is a URL', () => {
      expect(
        () =>
          new ContentClient({
            account: 'test',
            stagingEnvironment: 'http://staging.com',
          })
      ).to.throw(
        'Parameter "stagingEnvironment" should be a hostname not a URL'
      );
    });

    it('should throw if config.account is empty', () => {
      expect(() => new ContentClient({ account: '' })).to.throw(
        'Parameter "config" must contain a valid "account" name'
      );
    });
  });

  context('getContentItem', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://cdn.c1.amplience.net/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
          )
          .reply(200, V1_SINGLE_RESULT);

        const client = new ContentClient({
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '2c7efa09-7e31-4503-8d00-5a150ff82f17'
        );

        expect(response.toJSON()).to.deep.eq(SINGLE_ITEM_RESPONSE);
      });
    });
    context('ContentClientConfigV2', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
    context('ContentClientConfigV2Fresh', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
  });

  context('getContentItemById', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://cdn.c1.amplience.net/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
          )
          .reply(200, V1_SINGLE_RESULT);

        const client = new ContentClient({
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '2c7efa09-7e31-4503-8d00-5a150ff82f17'
        );

        expect(response.toJSON()).to.deep.eq(SINGLE_ITEM_RESPONSE);
      });
    });
    context('ContentClientConfigV2', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });

      it('should resolve use v2 if account was supplied', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
    context('ContentClientConfigV2Fresh', () => {
      it('should resolve use v2 if account was supplied', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          account: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
  });

  context('getContentItemByKey', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const client = new ContentClient({
          account: 'test',
        });

        expect(() => client.getContentItemByKey('content-key')).to.throw(
          'Not supported. You need to define "hubName" configuration property to use getContentItemByKey()'
        );
      });
    });
    context('ContentClientConfigV2', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/key/welcome-para-1?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemByKey('welcome-para-1');

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
    context('ContentClientConfigV2Fresh', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/key/welcome-para-1?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemByKey('welcome-para-1');

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
  });

  context('filterBy', () => {
    it('`filterBy` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterBy('something', 'http://bigcontent.io/schema').request()
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterBy()'
      );
    });

    it('`filterByContentType` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterByContentType('http://bigcontent.io/schema').request()
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterByContentType()'
      );
    });

    it('`filterByContentType` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterContentItems({
          filterBy: [],
        })
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterContentItems()'
      );
    });

    it('`filterByParentId` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterByParentId('1213123-12312-31231231').request()
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterByParentId()'
      );
    });

    it('`filterBy` should return `FilterBy` class if valid configuration', () => {
      const client = new ContentClient({
        account: 'test',
        hubName: 'test',
      });

      expect(
        client.filterBy('something', 'http://bigcontent.io/schema')
      ).to.instanceOf(FilterBy);
    });

    it('`filterByContentType`  should return `FilterBy` class if valid configuration', () => {
      const client = new ContentClient({
        hubName: 'test',
        account: 'test',
      });

      expect(
        client.filterByContentType('http://bigcontent.io/schema')
      ).to.be.instanceOf(FilterBy);
    });

    it('`filterByParentId`  should return `FilterBy` class if valid configuration', () => {
      const client = new ContentClient({
        account: 'test',
        hubName: 'test',
      });

      expect(
        client.filterByParentId('1213123-12312-31231231')
      ).to.be.instanceOf(FilterBy);
    });

    it('`filterByContentType` should throw if no cdv2 configuration', async () => {
      const mocks = new MockAdapter(null);

      mocks
        .onPost('https://test.cdn.content.amplience.net/content/filter', {
          filterBy: [
            {
              path: '/_meta/schema',
              value: 'https://filter-by-sort-by.com',
            },
          ],
        })
        .reply(200, NO_RESULTS);

      const client = new ContentClient({
        account: 'test',
        hubName: 'test',
        adaptor: mocks.adapter(),
      });

      const request = await client.filterContentItems({
        filterBy: [
          {
            path: '/_meta/schema',
            value: 'https://filter-by-sort-by.com',
          },
        ],
      });

      expect(request.responses).to.deep.equals(NO_RESULTS.responses);
      expect(request.page.responseCount).to.equals(0);
    });
  });
});
