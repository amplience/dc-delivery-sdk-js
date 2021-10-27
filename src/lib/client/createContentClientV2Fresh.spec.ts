import { expect } from 'chai';
import {
  createContentClientV2Fresh,
  getRetryConfig,
} from './createContentClientV2Fresh';

describe('createContentClientV2Fresh', () => {
  it('should add the apiKey to the client as an X-API-Key header', () => {
    const client = createContentClientV2Fresh(
      { hubName: 'hub', apiKey: 'api-key' },
      'https://example.com'
    );

    expect(client.defaults.baseURL).to.eq('https://example.com');
    expect(client.defaults.headers.common['X-API-Key']).to.eq('api-key');
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
    const mockError = {
      isAxiosError: true,
      name: '',
      message: '',
      config: {},
      toJSON: () => ({}),
    };

    expect(retryConfig.retries).to.eq(10);
    expect(retryConfig.retryDelay(1, mockError)).to.eq(10000);
    expect(retryConfig.retryCondition(mockError)).to.eq(false);
  });
});
