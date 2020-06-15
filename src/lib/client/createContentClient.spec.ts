import { expect } from 'chai';
import { createContentClient } from './createContentClient';

describe('createContentClient', () => {
  it('should default the base url', () => {
    const client = createContentClient({
      account: 'test'
    });

    expect(client.defaults.baseURL).to.eq('https://c1.adis.ws');
  });

  it('should use the override base url if provided', () => {
    const client = createContentClient({
      account: 'test',
      baseUrl: 'http://localhost:3000'
    });
    expect(client.defaults.baseURL).to.eq('http://localhost:3000');
  });

  it('should use the staging environment url if provided', () => {
    const client = createContentClient({
      account: 'test',
      baseUrl: 'http://localhost:3000',
      stagingEnvironment:
        'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
    });

    expect(client.defaults.baseURL).to.eq(
      'https://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
    );
  });

  it('should use the provided adaptor to send requests', () => {
    const client = createContentClient({
      account: 'test',
      adaptor: () =>
        Promise.resolve<any>({
          data: 'response'
        })
    });
    return client.get('/test').then(response => {
      expect(response).to.deep.eq({ data: 'response' });
    });
  });
});
