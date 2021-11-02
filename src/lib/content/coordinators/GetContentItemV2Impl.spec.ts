import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ContentMapper } from '../mapper/ContentMapper';
import { GetContentItemV2Impl } from './GetContentItemV2Impl';
import * as NO_RESULTS from './__fixtures__/v2/NO_RESULTS.json';
import * as RESULT from './__fixtures__/v2/RESULT.json';
import { ContentMeta } from '../model/ContentMeta';
import { Image } from '../../media/Image';
import { HttpError } from '../model/HttpError';
import { ContentNotFoundError } from '../model/ContentNotFoundError';
import { IContentClientRetryConfig } from '../../config/ContentClientConfigV2Fresh';

use(chaiAsPromised);

function createCoordinator(config: {
  hubName: string;
  locale?: string;
  apiKey?: string;
  retryConfig?: IContentClientRetryConfig;
}): [MockAdapter, GetContentItemV2Impl] {
  const mocks = new MockAdapter(null);
  const mergedConfig = { adaptor: mocks.adapter(), ...config };
  const client = new GetContentItemV2Impl(
    mergedConfig,
    new ContentMapper(mergedConfig)
  );
  return [mocks, client];
}

const cd2RunConfig = {
  name: 'cdv2',
  type: 'cdn',
  host: 'https://hub.cdn.content.amplience.net',
  config: { hubName: 'hub' },
};

const freshRunConfig = {
  name: 'fresh',
  type: 'fresh',
  host: 'https://hub.fresh.content.amplience.net',
  config: {
    hubName: 'hub',
    apiKey: 'apiKey',
    retryConfig: {
      retryDelay: () => 0,
    },
  },
};

const runs = [cd2RunConfig, freshRunConfig];

describe('GetContentItemV2Impl', () => {
  runs.forEach(({ type, config, host }) => {
    describe(`${type}`, () => {
      context('getContentItemById', () => {
        it('should reject if content item not found', (done) => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_US',
          });
          mocks
            .onGet(
              `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=en_US`
            )
            .reply(404, NO_RESULTS);
          expect(
            coordinator.getContentItemById(
              '2c7efa09-7e31-4503-8d00-5a150ff82f17'
            )
          )
            .to.eventually.rejectedWith(
              ContentNotFoundError,
              'Content item "2c7efa09-7e31-4503-8d00-5a150ff82f17" was not found'
            )
            .and.notify(done);
        });

        it('should resolve if content item is found', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_US',
          });
          mocks
            .onGet(
              `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=en_US`
            )
            .reply(200, RESULT);

          const response = await coordinator.getContentItemById(
            '2c7efa09-7e31-4503-8d00-5a150ff82f17'
          );

          expect(response.toJSON()).to.deep.eq(RESULT['content']);
          expect(response.body._meta).to.be.instanceOf(ContentMeta);
        });

        it('should use hubName as the subdomain in the hostname', async () => {
          const [mocks, coordinator] = createCoordinator(config);
          mocks
            .onGet(
              `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined`
            )
            .reply(200, RESULT);

          const response = await coordinator.getContentItemById(
            '2c7efa09-7e31-4503-8d00-5a150ff82f17'
          );

          expect(response.toJSON()).to.deep.eq(RESULT['content']);
        });

        it('should use locale as the subdomain in the hostname', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'fr_FR',
          });
          mocks
            .onGet(
              `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=fr_FR`
            )
            .reply(200, RESULT);

          const response = await coordinator.getContentItemById(
            '2c7efa09-7e31-4503-8d00-5a150ff82f17'
          );

          expect(response.toJSON()).to.deep.eq(RESULT['content']);
        });

        if (type === freshRunConfig.type) {
          it('should throw "Exceeded rate limit" if retries failed', async () => {
            const [mocks, coordinator] = createCoordinator({
              ...config,
              locale: 'en_US',
            });

            const data = {
              error: {
                type: 'THROTTLED_REQUEST',
                message: 'Exceeded rate limit',
              },
            };

            mocks
              .onGet(
                `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data)
              .onGet(
                `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data)
              .onGet(
                `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data)
              .onGet(
                `${host}/content/id/2c7efa09-7e31-4503-8d00-5a150ff82f17?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data);

            expect(
              coordinator.getContentItemById(
                '2c7efa09-7e31-4503-8d00-5a150ff82f17'
              )
            ).to.be.rejectedWith('Exceeded rate limit');
          });
        }
      });

      context('getContentItemByKey', () => {
        it('should reject if content item not found', (done) => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_US',
          });
          mocks
            .onGet(
              `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
            )
            .reply(404, NO_RESULTS);
          expect(coordinator.getContentItemByKey('a-delivery-key'))
            .to.eventually.rejectedWith(
              ContentNotFoundError,
              'Content item "a-delivery-key" was not found'
            )
            .and.notify(done);
        });

        it('should reject if request fails', (done) => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_US',
          });
          mocks
            .onGet(
              `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
            )
            .reply(500, 'Internal Server Error');
          expect(coordinator.getContentItemByKey('a-delivery-key'))
            .to.eventually.rejectedWith(HttpError, 'Internal Server Error')
            .and.notify(done);
        });

        it('should resolve if content item is found', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_US',
          });
          mocks
            .onGet(
              `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
            )
            .reply(200, RESULT);

          const response = await coordinator.getContentItemByKey(
            'a-delivery-key'
          );

          expect(response.toJSON()).to.deep.eq(RESULT['content']);
          expect(response.body._meta).to.be.instanceOf(ContentMeta);
          expect(response.body['image'].image).to.be.instanceOf(Image);
          expect(response.body['authors'][0].avatar.image).to.be.instanceOf(
            Image
          );
        });

        it('should use hubName as the subdomain in the hostname', async () => {
          const [mocks, coordinator] = createCoordinator(config);
          mocks
            .onGet(
              `${host}/content/key/a-delivery-key?depth=all&format=inlined`
            )
            .reply(200, RESULT);

          const response = await coordinator.getContentItemByKey(
            'a-delivery-key'
          );

          expect(response.toJSON()).to.deep.eq(RESULT['content']);
        });

        it('should use locale as the subdomain in the hostname', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'fr_FR',
          });
          mocks
            .onGet(
              `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=fr_FR`
            )
            .reply(200, RESULT);

          const response = await coordinator.getContentItemByKey(
            'a-delivery-key'
          );

          expect(response.toJSON()).to.deep.eq(RESULT['content']);
        });
        if (type === freshRunConfig.type) {
          it('should throw "Exceeded rate limit" if retries failed', async () => {
            const [mocks, coordinator] = createCoordinator({
              ...config,
              locale: 'en_US',
            });

            const data = {
              error: {
                type: 'THROTTLED_REQUEST',
                message: 'Exceeded rate limit',
              },
            };

            mocks
              .onGet(
                `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data)
              .onGet(
                `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data)
              .onGet(
                `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data)
              .onGet(
                `${host}/content/key/a-delivery-key?depth=all&format=inlined&locale=en_US`
              )
              .replyOnce(429, data);

            expect(
              coordinator.getContentItemByKey('a-delivery-key')
            ).to.be.rejectedWith('Exceeded rate limit');
          });
        }
      });
    });
  });
});
