import { expect } from 'chai';
import { ContentClient } from '../index';
import { ContentClientConfig } from './ContentClientConfig';

describe('ContentClient', () => {
  context('configuration', () => {
    it('should throw if config is not provided', () => {
      expect(() => new ContentClient(null)).to.throw(
        'Parameter "config" is required'
      );
    });

    it('should throw if config.account is not provided', () => {
      expect(
        () => new ContentClient(({} as unknown) as ContentClientConfig)
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

  context('createContentClient', () => {
    it('should default the base url', () => {
      const client = (new ContentClient({
        account: 'test',
      }) as unknown)['contentClient'];

      expect(client.defaults.baseURL).to.eq('https://c1.adis.ws');
    });

    it('should use the override base url if provided', () => {
      const client = (new ContentClient({
        account: 'test',
        baseUrl: 'http://localhost:3000',
      }) as unknown)['contentClient'];
      expect(client.defaults.baseURL).to.eq('http://localhost:3000');
    });

    it('should use the staging environment url if provided', () => {
      const client = (new ContentClient({
        account: 'test',
        baseUrl: 'http://localhost:3000',
        stagingEnvironment:
          'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io',
      }) as unknown)['contentClient'];

      expect(client.defaults.baseURL).to.eq(
        'https://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
      );
    });

    it('should use the provided adaptor to send requests', () => {
      const client = (new ContentClient({
        account: 'test',
        adaptor: () =>
          Promise.resolve<any>({
            data: 'response',
          }),
      }) as unknown)['contentClient'];
      return client.get('/test').then((response) => {
        expect(response).to.deep.eq({ data: 'response' });
      });
    });
  });
});
