import { expect } from 'chai';

import { createContentClientV2 } from './createContentClientV2';

describe('createContentClientV2', () => {
  it('should create a v2 client', () => {
    const client = createContentClientV2({ hubName: 'hub' });

    expect(client.defaults.baseURL).to.eq(
      'https://hub.cdn.content.amplience.net'
    );
    expect(client.defaults.headers.common['X-API-Key']).to.be.undefined;
  });

  it('should create a v2 fresh client', () => {
    const client = createContentClientV2({ hubName: 'hub', apiKey: 'key' });

    expect(client.defaults.baseURL).to.eq(
      'https://hub.fresh.content.amplience.net'
    );
    expect(client.defaults.headers.common['X-API-Key']).to.eq('key');
  });
});
