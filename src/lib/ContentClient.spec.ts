import { expect } from 'chai';
import { ContentClient } from '../index';
import MockAdapter from 'axios-mock-adapter';
import { SINGLE_RESULT } from './content/test/fixtures';

describe('ContentClient', () => {
  context('configuration', () => {
    it('should throw if config is not provided', () => {
      expect(() => new ContentClient(null)).to.throw(
        'Parameter "config" is required'
      );
    });

    it('should throw if config.account is not provided', () => {
      expect(() => new ContentClient(<any>{})).to.throw(
        'Parameter "config" must contain a valid "account" name'
      );
    });

    it('should throw if config.stagingEnvironment is a URL', () => {
      expect(
        () =>
          new ContentClient(<any>{
            account: 'test',
            stagingEnvironment: 'http://staging.com'
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
    it('should resolve if content item is found', async () => {
      const mocks = new MockAdapter(null);
      mocks
        .onGet(
          'https://c1.adis.ws/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
        )
        .reply(200, SINGLE_RESULT);

      const client = new ContentClient({
        account: 'test',
        adaptor: mocks.adapter()
      });

      const response = await client.getContentItem(
        '2c7efa09-7e31-4503-8d00-5a150ff82f17'
      );

      expect(response.toJSON()).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          name: 'name',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
        }
      });
    });
  });
});
