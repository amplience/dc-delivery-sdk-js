import { expect } from 'chai';
import { createContentClient } from './createContentClient';

describe('createContentClient', () => {
  it('should create a v2 client', () => {
    const client = createContentClient({ hubName: 'hub' });

    expect(client.defaults.baseURL).to.eq(
      'https://hub.cdn.content.amplience.net'
    );
    expect(client.defaults.headers.common['X-API-Key']).to.be.undefined;
  });

  it('should create a v2 fresh client', () => {
    const client = createContentClient({ hubName: 'hub', apiKey: 'key' });

    expect(client.defaults.baseURL).to.eq(
      'https://hub.fresh.content.amplience.net'
    );
    expect(client.defaults.headers.common['X-API-Key']).to.eq('key');
  });
});
