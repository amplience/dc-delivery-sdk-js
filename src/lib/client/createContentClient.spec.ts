import { expect } from 'chai';
import { createContentClient } from './createContentClient';

describe('createContentClient', () => {
  it('should default the base url', () => {
    const client = createContentClient({}, 'https://example.com');

    expect(client.defaults.baseURL).to.eq('https://example.com');
  });

  it('should use the override base url if provided', () => {
    const client = createContentClient(
      {
        baseUrl: 'http://localhost:3000',
      },
      'https://example.com'
    );
    expect(client.defaults.baseURL).to.eq('http://localhost:3000');
  });

  it('should use the staging environment url if provided', () => {
    const client = createContentClient(
      {
        baseUrl: 'http://localhost:3000',
        stagingEnvironment:
          'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io',
      },
      'https://example.com'
    );

    expect(client.defaults.baseURL).to.eq(
      'https://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
    );
  });

  it('should use the provided adaptor to send requests', () => {
    const client = createContentClient(
      {
        adaptor: () =>
          Promise.resolve<any>({
            data: 'response',
          }),
      },
      'https://example.com'
    );
    return client.get('/test').then((response) => {
      expect(response).to.deep.eq({ data: 'response' });
    });
  });
});
