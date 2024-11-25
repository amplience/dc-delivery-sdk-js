import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { GetContentItemsV2Impl } from './GetContentItemsV2Impl';
import RESULT from './__fixtures__/v2/fetch/RESULT.json';

import { createContentClient } from '../../client/createContentClient';
import { HttpError } from '../model/HttpError';
import Axios from 'axios';

use(chaiAsPromised);

function createCoordinator(config): [MockAdapter, GetContentItemsV2Impl] {
  const mocks = new MockAdapter(Axios);
  const mergedConfig = { adaptor: mocks.adapter(), ...config };
  const client = createContentClient(mergedConfig);

  const coordinator = new GetContentItemsV2Impl(mergedConfig, client);
  return [mocks, coordinator];
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

describe('GetContentItemsV2Impl', () => {
  runs.forEach(({ name, type, config, host }) => {
    describe(`${name}`, () => {
      context('fetchContentItems', () => {
        it('should default parameters', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
          });

          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'inlined',
              },
              requests: [
                {
                  id: '1',
                },
              ],
            })
            .replyOnce(200, RESULT);

          const response = await coordinator.fetchContentItems({
            requests: [{ id: '1' }],
          });

          expect(response).to.deep.eq(RESULT);
        });

        it('should merge default parameters with passed in parameters', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
          });

          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'linked',
              },
              requests: [
                {
                  id: '1',
                },
              ],
            })
            .replyOnce(200, RESULT);

          const response = await coordinator.fetchContentItems({
            parameters: {
              format: 'linked',
            },
            requests: [{ id: '1' }],
          });

          expect(response).to.deep.eq(RESULT);
        });

        it('should use locale set in config', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_US',
          });

          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'inlined',
                locale: 'en_US',
              },
              requests: [
                {
                  id: '1',
                },
              ],
            })
            .replyOnce(200, RESULT);

          const response = await coordinator.fetchContentItems({
            requests: [{ id: '1' }],
          });

          expect(response).to.deep.eq(RESULT);
        });

        it('should use locale set in parameters', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            locale: 'en_FR',
          });

          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'inlined',
                locale: 'en',
              },
              requests: [
                {
                  id: '1',
                },
              ],
            })
            .replyOnce(200, RESULT);

          const response = await coordinator.fetchContentItems({
            parameters: {
              locale: 'en',
            },
            requests: [{ id: '1' }],
          });

          expect(response).to.deep.eq(RESULT);
        });

        it('should throw an HttpError if request fails', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
          });
          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'inlined',
                locale: 'en',
              },
              requests: [
                {
                  id: '1',
                },
              ],
            })
            .replyOnce(400, {
              error: {
                type: 'NO_REQUESTS_PROVIDED',
                message: 'Must supply at least one request',
              },
            });
          await expect(
            coordinator.fetchContentItems({
              parameters: {
                locale: 'en',
              },
              requests: [{ id: '1' }],
            })
          ).to.be.rejectedWith(HttpError, 'Must supply at least one request');
        });
      });

      context('getContentItemsById', () => {
        it('should throw if ids argument is not an array', async () => {
          const [, coordinator] = createCoordinator({
            ...config,
          });

          await expect(
            (coordinator as any).getContentItemsByKey(1)
          ).to.be.rejectedWith('Expecting an array');
        });

        it('should make a request with the correct request body', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
          });

          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'inlined',
              },
              requests: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
              ],
            })
            .replyOnce(200, RESULT);

          const response = await coordinator.getContentItemsById(['1', '2']);
          expect(response).to.deep.eq(RESULT);
        });
      });
      context('getContentItemsByKey', () => {
        it('should throw if keys argument is not an array', async () => {
          const [, coordinator] = createCoordinator({
            ...config,
          });

          await expect(
            (coordinator as any).getContentItemsByKey(1)
          ).to.be.rejectedWith('Expecting an array');
        });

        it('should make a request with the correct request body', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
          });

          mocks
            .onPost(`${host}/content/fetch`, {
              parameters: {
                depth: 'all',
                format: 'inlined',
              },
              requests: [
                {
                  key: 'blog/article-1',
                },
                {
                  key: 'blog/article-2',
                },
              ],
            })
            .replyOnce(200, RESULT);

          const response = await coordinator.getContentItemsByKey([
            'blog/article-1',
            'blog/article-2',
          ]);
          expect(response).to.deep.eq(RESULT);
        });

        if (type === freshRunConfig.type) {
          it('should throw "Exceeded rate limit" if retries failed', async () => {
            const [mocks, coordinator] = createCoordinator({
              ...config,
              retryConfig: { retryDelay: () => 0 },
            });

            const body = {
              parameters: {
                depth: 'all',
                format: 'inlined',
              },
              requests: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
                {
                  id: '3',
                },
              ],
            };

            const data = {
              error: {
                type: 'THROTTLED_REQUEST',
                message: 'Exceeded rate limit',
              },
            };

            mocks
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(429, data)
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(429, data)
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(429, data)
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(429, data);

            await expect(
              coordinator.getContentItemsById(['1', '2', '3'])
            ).to.be.rejectedWith('Exceeded rate limit');
          });

          it('should return response on third retry', async () => {
            const [mocks, coordinator] = createCoordinator({
              ...config,
              retryConfig: { retryDelay: () => 0 },
            });

            const data = {
              error: {
                type: 'THROTTLED_REQUEST',
                message: 'Exceeded rate limit',
              },
            };

            const body = {
              parameters: {
                depth: 'all',
                format: 'inlined',
              },
              requests: [
                {
                  id: '1',
                },
                {
                  id: '2',
                },
                {
                  id: '3',
                },
              ],
            };
            mocks
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(429, data)
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(429, data)
              .onPost(`${host}/content/fetch`, body)
              .replyOnce(200, RESULT);

            const response = await coordinator.getContentItemsById([
              '1',
              '2',
              '3',
            ]);

            expect(response).to.deep.equals(RESULT);
          });
        }
      });
    });
  });
});
