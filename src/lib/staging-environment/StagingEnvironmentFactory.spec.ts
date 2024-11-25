import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { StagingEnvironmentFactory } from './StagingEnvironmentFactory';
import { StagingEnvironmentFactoryConfig } from './StagingEnvironmentFactoryConfig';
import Axios from 'axios';

function createFactory(
  stagingEnvironment: string,
  config: StagingEnvironmentFactoryConfig = {}
): [MockAdapter, StagingEnvironmentFactory] {
  const mocks = new MockAdapter(Axios.create());
  const client = new StagingEnvironmentFactory(stagingEnvironment, {
    adaptor: mocks.adapter(),
    ...config,
  });
  return [mocks, client];
}

describe('StagingEnvironmentFactory', () => {
  context('generateDomain', () => {
    const stagingEnvironment = 'abcdef123456.staging.bigcontent.io';

    it('should get a snapshot URL with a snapshotId', async () => {
      const [mocks, factory] = createFactory(stagingEnvironment);

      const snapshotId = '00112233445566778899aabb';
      mocks
        .onGet(`/domain/${stagingEnvironment}?snapshotId=${snapshotId}`)
        .reply(
          200,
          'abcdef123456-fancfubgVq-00112233445566778899nnoo.staging.bigcontent.io'
        );

      const response = await factory.generateDomain({
        snapshotId: snapshotId,
      });

      expect(response).to.eq(
        'abcdef123456-fancfubgVq-00112233445566778899nnoo.staging.bigcontent.io'
      );
    });

    it('should get a snapshot URL with a timestamp', async () => {
      const [mocks, factory] = createFactory(stagingEnvironment);

      const timestamp = 1581598599444;
      mocks
        .onGet(`/domain/${stagingEnvironment}?timestamp=${timestamp}`)
        .reply(
          200,
          'abcdef123456-gvzrfgnzc-1581598599444.staging.bigcontent.io'
        );

      const response = await factory.generateDomain({
        timestamp: timestamp,
      });

      expect(response).to.eq(
        'abcdef123456-gvzrfgnzc-1581598599444.staging.bigcontent.io'
      );
    });

    it('should be possible to supply a different baseUrl', async () => {
      const [mocks, factory] = createFactory(stagingEnvironment, {
        baseUrl: 'http://example.com',
      });

      mocks
        .onGet(`/domain/${stagingEnvironment}?`)
        .reply(200, stagingEnvironment);

      const response = await factory.generateDomain({});

      expect(mocks.history.get[0].baseURL).to.equal('http://example.com');
      expect(response).to.equal(stagingEnvironment);
    });

    it('should throw when the API returns an error', async () => {
      const [mocks, factory] = createFactory(stagingEnvironment);

      mocks.onGet(`/domain/${stagingEnvironment}`).reply(404, 'Not Found');

      await expect(factory.generateDomain({})).to.rejectedWith(
        "An error occurred whilst attempting to generate a staging environment domain using options '{}': Request failed with status code 404"
      );
    });
  });
});
