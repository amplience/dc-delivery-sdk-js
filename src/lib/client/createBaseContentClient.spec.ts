import { expect } from 'chai';
import { createBaseContentClient } from './createBaseContentClient';

describe('createBaseContentClient', () => {
  it('should default the base url', () => {
    const client = createBaseContentClient({}, 'https://example.com');

    expect(client.defaults.baseURL).to.eq('https://example.com');
  });

  it('should use the override base url if provided', () => {
    const client = createBaseContentClient(
      {
        baseUrl: 'http://localhost:3000',
      },
      'https://example.com'
    );
    expect(client.defaults.baseURL).to.eq('http://localhost:3000');
  });

  it('should use the staging environment url if provided', () => {
    const client = createBaseContentClient(
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
    const client = createBaseContentClient(
      {
        adaptor: () =>
          Promise.resolve<any>({
            data: 'response',
            headers: {},
          }),
      },
      'https://example.com'
    );
    return client.get('/test').then((response) => {
      expect(JSON.parse(JSON.stringify(response))).to.deep.eq({
        data: 'response',
        headers: {},
      });
    });
  });

  it('should pass the timeout to the adaptor if provided', () => {
    let adaptorTimeout = -1;

    const client = createBaseContentClient(
      {
        adaptor: (config) => {
          adaptorTimeout = config.timeout;

          return Promise.resolve<any>({
            data: 'response',
            headers: {},
          });
        },
        timeout: 1234,
      },
      'https://example.com'
    );

    return client.get('/test').then((response) => {
      expect(JSON.parse(JSON.stringify(response))).to.deep.eq({
        data: 'response',
        headers: {},
      });
      expect(adaptorTimeout).to.eq(1234);
    });
  });
});
