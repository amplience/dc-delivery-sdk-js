import { expect } from 'chai';
import {
  createContentClientV2Fresh,
  getRetryConfig,
} from './createContentClientV2Fresh';

describe('createContentClientV2Fresh', () => {
  it('should add the token to the client as an X-API-Key header', () => {
    const client = createContentClientV2Fresh(
      { hubName: 'hub', token: 'my-token' },
      'https://example.com'
    );

    expect(client.defaults.baseURL).to.eq('https://example.com');
    expect(client.defaults.headers.common['X-API-Key']).to.eq('my-token');
  });

  it('should return default retry config', () => {
    const retryConfig = getRetryConfig();

    expect(retryConfig.retries).to.eq(3);
    expect(retryConfig.retryDelay).to.be.a('function');
    expect(retryConfig.retryCondition).to.be.a('function');
  });

  it('should override default retry config', () => {
    const retryConfig = getRetryConfig({
      retries: 10,
      retryDelay: (count) => count * 10000,
      retryCondition: () => false,
    });

    expect(retryConfig.retries).to.eq(10);
    expect(
      retryConfig.retryDelay(1, {
        isAxiosError: true,
        name: '',
        message: '',
        config: {},
        toJSON: () => ({}),
      })
    ).to.eq(10000);

    expect(
      retryConfig.retryCondition({
        isAxiosError: true,
        name: '',
        message: '',
        config: {},
        toJSON: () => ({}),
      })
    ).to.eq(false);
  });
});
