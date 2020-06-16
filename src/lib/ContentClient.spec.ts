import { expect } from 'chai';
import { ContentClient } from '../index';
import MockAdapter from 'axios-mock-adapter';
import * as V1_SINGLE_RESULT from './content/coordinators/__fixtures__/v1/SINGLE_RESULT.json';
import * as V2_SINGLE_RESULT from './content/coordinators/__fixtures__/v2/SINGLE_RESULT.json';
import { ContentClientConfigV1 } from './config/ContentClientConfigV1';

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
            'https://c1.adis.ws/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
          )
          .reply(200, V1_SINGLE_RESULT);

        const client = new ContentClient({
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '2c7efa09-7e31-4503-8d00-5a150ff82f17'
        );

        expect(response.toJSON()).to.deep.eq({
          _meta: {
            deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
            name: 'name',
            schema:
              'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
          },
        });
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
  });

  context('getContentItemById', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(null);
        mocks
          .onGet(
            'https://c1.adis.ws/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
          )
          .reply(200, V1_SINGLE_RESULT);

        const client = new ContentClient({
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '2c7efa09-7e31-4503-8d00-5a150ff82f17'
        );

        expect(response.toJSON()).to.deep.eq({
          _meta: {
            deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
            name: 'name',
            schema:
              'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
          },
        });
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
  });
});
