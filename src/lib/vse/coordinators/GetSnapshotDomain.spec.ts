import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { GetSnapshotDomain } from './GetSnapshotDomain';

function createCoordinator(
  vseDomain: string
): [MockAdapter, GetSnapshotDomain] {
  const mocks = new MockAdapter(null);
  const config = { vseDomain, adaptor: mocks.adapter() };
  const networkClient = Axios.create({
    baseURL: 'https://virtual-staging.adis.ws',
    adapter: mocks.adapter()
  });

  const client = new GetSnapshotDomain(config, networkClient);
  return [mocks, client];
}

describe('GetSnapshotDomain', () => {
  context('getUrl', () => {
    it('should create a new URL from the vseDomain with a snapshotid', () => {
      const snapshotId = '25e2de58-d97a-4167-93d9-ba62ac251ee3';
      const [, coordinator] = createCoordinator(
        '1dg9lsggokzjn1.staging.bigcontent.io'
      );
      expect(coordinator.getUrl(snapshotId)).to.eq(
        `/domain/1dg9lsggokzjn1.staging.bigcontent.io?snapshotid=${snapshotId}`
      );
    });

    it('should create a new URL from the vseDomain with a snapshotid and timestamp', () => {
      const snapshotId = '25e2de58-d97a-4167-93d9-ba62ac251ee3';
      const timestamp = 1580833302;
      const [, coordinator] = createCoordinator(
        '1dg9lsggokzjn1.staging.bigcontent.io'
      );
      expect(coordinator.getUrl(snapshotId, timestamp)).to.eq(
        `/domain/1dg9lsggokzjn1.staging.bigcontent.io?snapshotid=${snapshotId}&timestamp=${timestamp}`
      );
    });
  });

  context('getSnapshotDomain', () => {
    let mocks: MockAdapter;
    let coordinator: GetSnapshotDomain;

    beforeEach(() => {
      [mocks, coordinator] = createCoordinator(
        '1dg9lsggokzjn1.staging.bigcontent.io'
      );
    });

    it('should get a snapshot URL with a snapshotid', done => {
      mocks
        .onGet(
          '/domain/1dg9lsggokzjn1.staging.bigcontent.io?snapshotid=2c7efa09-7e31-4503-8d00-5a150ff82f17'
        )
        .reply(
          200,
          '1dg9lsggokzjn1-fancfubgvq-adnbuovbascnbj-gvzrfgnzc-cjisr32dqw3d3fda.staging.bigcontent.io'
        );

      const response = coordinator.getSnapshotDomain(
        '2c7efa09-7e31-4503-8d00-5a150ff82f17'
      );

      expect(response)
        .to.eventually.eq(
          '1dg9lsggokzjn1-fancfubgvq-adnbuovbascnbj-gvzrfgnzc-cjisr32dqw3d3fda.staging.bigcontent.io'
        )
        .notify(done);
    });

    it('should get a snapshot URL with a snapshotid and timestamp', done => {
      mocks
        .onGet(
          '/domain/1dg9lsggokzjn1.staging.bigcontent.io?snapshotid=2c7efa09-7e31-4503-8d00-5a150ff82f17&timestamp=1580833302'
        )
        .reply(
          200,
          '1dg9lsggokzjn1-fancfubgvq-adnbuovbascnbj-gvzrfgnzc-cjisr32dqw3d3fda.staging.bigcontent.io'
        );

      const response = coordinator.getSnapshotDomain(
        '2c7efa09-7e31-4503-8d00-5a150ff82f17',
        1580833302
      );

      expect(response)
        .to.eventually.eq(
          '1dg9lsggokzjn1-fancfubgvq-adnbuovbascnbj-gvzrfgnzc-cjisr32dqw3d3fda.staging.bigcontent.io'
        )
        .notify(done);
    });

    it('should throw when the API returns an error', done => {
      mocks
        .onGet(
          '/domain/1dg9lsggokzjn1.staging.bigcontent.io?snapshotid=2c7efa09-7e31-4503-8d00-5a150ff82f17&timestamp=1580833302'
        )
        .reply(404, 'Not Found');

      expect(
        coordinator.getSnapshotDomain('2c7efa09-7e31-4503-8d00-5a150ff82f17')
      )
        .to.eventually.rejectedWith(
          "An error occurred whilst attempting to get VSE domain for snapshot '2c7efa09-7e31-4503-8d00-5a150ff82f17': Request failed with status code 404"
        )
        .and.notify(done);
    });
  });
});
