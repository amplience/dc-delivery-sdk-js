import { expect } from 'chai';
import { ContentClient } from '../index';

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

  context('createContentClient', () => {
    it('should default the base url', () => {
      const client = (<any>new ContentClient({
        account: 'test'
      })).contentClient;

      expect(client.defaults.baseURL).to.eq('https://c1.adis.ws');
    });

    it('should use the override base url if provided', () => {
      const client = (<any>new ContentClient({
        account: 'test',
        baseUrl: 'http://localhost:3000'
      })).contentClient;
      expect(client.defaults.baseURL).to.eq('http://localhost:3000');
    });

    it('should use the staging environment url if provided', () => {
      const client = (<any>new ContentClient({
        account: 'test',
        baseUrl: 'http://localhost:3000',
        stagingEnvironment:
          'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
      })).contentClient;

      expect(client.defaults.baseURL).to.eq(
        'https://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
      );
    });

    it('should use the provided adaptor to send requests', () => {
      const client = (<any>new ContentClient({
        account: 'test',
        adaptor: () =>
          Promise.resolve<any>({
            data: 'response'
          })
      })).contentClient;
      return client.get('/test').then(response => {
        expect(response).to.deep.eq({ data: 'response' });
      });
    });
  });
});
