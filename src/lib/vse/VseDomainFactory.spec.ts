import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { VseDomainFactory } from './VseDomainFactory';
import { VseDomainFactoryConfig } from './VseDomainFactoryConfig';

function createFactory(
  vseDomain: string,
  config: VseDomainFactoryConfig = {}
): [MockAdapter, VseDomainFactory] {
  const mocks = new MockAdapter(null);
  const client = new VseDomainFactory(vseDomain, {
    adaptor: mocks.adapter(),
    ...config
  });
  return [mocks, client];
}

describe('VseDomainFactory', () => {
  context('getDomain', () => {
    const vseDomain = 'abcdef123456.staging.bigcontent.io';

    it('should get a snapshot URL with a snapshotId', async () => {
      const [mocks, factory] = createFactory(vseDomain);

      const snapshotId = '00112233445566778899aabb';
      mocks
        .onGet(`/domain/${vseDomain}?snapshotId=${snapshotId}`)
        .reply(
          200,
          'abcdef123456-fancfubgVq-00112233445566778899nnoo.staging.bigcontent.io'
        );

      const response = await factory.getDomain({
        snapshotId: snapshotId
      });

      expect(response).to.eq(
        'abcdef123456-fancfubgVq-00112233445566778899nnoo.staging.bigcontent.io'
      );
    });

    it('should get a snapshot URL with a timestamp', async () => {
      const [mocks, factory] = createFactory(vseDomain);

      const timestamp = 1580833302;
      mocks
        .onGet(`/domain/${vseDomain}?timestamp=${timestamp}`)
        .reply(200, 'abcdef123456-gvzrfgnzc-1580833302.staging.bigcontent.io');

      const response = await factory.getDomain({
        timestamp: timestamp
      });

      expect(response).to.eq(
        'abcdef123456-gvzrfgnzc-1580833302.staging.bigcontent.io'
      );
    });

    it('should be possible to supply a different baseUrl', async () => {
      const [mocks, factory] = createFactory(vseDomain, {
        baseUrl: 'http://example.com'
      });

      mocks.onGet(`/domain/${vseDomain}?`).reply(200, vseDomain);

      const response = await factory.getDomain({});

      expect(mocks.history.get[0].baseURL).to.equal('http://example.com');
      expect(response).to.equal(vseDomain);
    });

    it('should throw when the API returns an error', async () => {
      const [mocks, factory] = createFactory(vseDomain);

      mocks.onGet(`/domain/${vseDomain}`).reply(404, 'Not Found');

      await expect(factory.getDomain({})).to.rejectedWith(
        "An error occurred whilst attempting to get VSE domain using options '{}': Request failed with status code 404"
      );
    });
  });
});
