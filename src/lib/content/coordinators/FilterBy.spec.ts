import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as NO_RESULTS from './__fixtures__/filterBy/NO_RESULTS.json';
import * as PAGED_RESPONSE from './__fixtures__/filterBy/PAGED_RESPONSE.json';

import { FilterBy } from './FilterBy';
import { HttpError } from '../model/HttpError';
import { createContentClient } from '../../client/createContentClient';

use(chaiAsPromised);

function createCoordinator<T = any>(config: any): [MockAdapter, FilterBy<T>] {
  const mocks = new MockAdapter(null);
  const mergedConfig = { ...config, adaptor: mocks.adapter() };
  const client = createContentClient(mergedConfig);
  const coordinator = new FilterBy<T>(mergedConfig, client);
  return [mocks, coordinator];
}

const cd2RunConfig = {
  name: 'cdv2',
  type: 'cdn',
  endpoint: 'https://hub.cdn.content.amplience.net/content/filter',
  config: { hubName: 'hub' },
};

const freshRunConfig = {
  name: 'fresh',
  type: 'fresh',
  endpoint: 'https://hub.fresh.content.amplience.net/content/filter',
  config: { hubName: 'hub', apiKey: 'key' },
};

const runs = [cd2RunConfig, freshRunConfig];

describe(`FilterBy`, () => {
  runs.forEach(({ name, type, endpoint, config }) => {
    describe(`${name}`, () => {
      it('should return no items response if no items found', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
          .request();

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
      });

      it('should return no items response if no items found with filterByContentType helper method', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterByContentType('https://filter-by-sort-by.com')
          .request();

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
      });

      it('should return no items response if no items found with filterByParentId helper method', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/hierarchy/parentId',
                value: '121313-13131-131313',
              },
            ],
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterByParentId('121313-13131-131313')
          .request();

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
      });

      it('should add all parameters to match request object', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
              {
                path: '/_meta/category',
                value: 'metal',
              },
            ],
            sortBy: {
              key: 'default',
              order: 'ASC',
            },
            page: {
              size: 12,
            },
            parameters: {
              format: 'inlined',
              depth: 'all',
            },
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterByContentType('https://filter-by-sort-by.com')
          .filterBy('/_meta/category', 'metal')
          .sortBy('default', 'ASC')
          .page(12)
          .request({
            format: 'inlined',
            depth: 'all',
          });

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
        expect(request.page.next).to.equals(undefined);
      });

      it('should add helper method to `page` when a cursor is returned', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
          })
          .reply(200, PAGED_RESPONSE);

        const request = await coordinator
          .filterByContentType('https://filter-by-sort-by.com')
          .request();

        expect(request.responses).to.deep.equals(PAGED_RESPONSE.responses);
        expect(request.page.responseCount).to.equals(0);
        expect(request.page.nextCursor).to.equal('123124124124124124');
        expect(typeof request.page.next).to.equals('function');

        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
            page: {
              cursor: '123124124124124124',
            },
          })
          .reply(200, NO_RESULTS);

        const request2 = await request.page.next();

        expect(request2.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request2.page.responseCount).to.equals(0);
        expect(request2.page.next).to.equals(undefined);
      });

      it('should pass cursor if two parameters are passed too `page`', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
            page: {
              size: 10,
              cursor: '12121212',
            },
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterByContentType('https://filter-by-sort-by.com')
          .page(10, '12121212')
          .request();

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
        expect(request.page.next).to.equals(undefined);
      });

      it('should set locale to global config', async () => {
        const [mocks, coordinator] = createCoordinator({
          locale: 'en-GB',
          ...config,
        });
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
            parameters: {
              locale: 'en-GB',
            },
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
          .request();

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
      });

      it('should set locale to passed value', async () => {
        const [mocks, coordinator] = createCoordinator({
          locale: 'en-GB',
          ...config,
        });
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
            parameters: {
              locale: 'us-GB',
            },
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
          .request({ locale: 'us-GB' });

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
      });

      it('should set cursor if string passed to page', async () => {
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
            page: {
              cursor: 'cursor',
            },
          })
          .reply(200, NO_RESULTS);

        const request = await coordinator
          .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
          .page('cursor')
          .request();

        expect(request.responses).to.deep.equals(NO_RESULTS.responses);
        expect(request.page.responseCount).to.equals(0);
      });

      it('should throw HttpError', async () => {
        const data = {
          error: {
            type: 'REQUEST_PROPERTY_VALUE_INVALID',
            message: 'Invalid property value in request body',
            data: { key: 'depth', value: 'sasdsd' },
          },
        };
        const [mocks, coordinator] = createCoordinator(config);
        mocks
          .onPost(endpoint, {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
              },
            ],
          })
          .replyOnce(400, data);

        await expect(
          coordinator
            .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
            .request()
        ).to.be.rejectedWith(
          HttpError,
          'Invalid property value in request body'
        );
      });

      if (type === freshRunConfig.type) {
        it('should throw "Exceeded rate limit" if retries failed', async () => {
          const [mocks, coordinator] = createCoordinator({
            ...config,
            retryConfig: { retryDelay: () => 0 },
          });

          const body = {
            filterBy: [
              {
                path: '/_meta/schema',
                value: 'https://filter-by-sort-by.com',
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
            .onPost(endpoint, body)
            .replyOnce(429, data)
            .onPost(endpoint, body)
            .replyOnce(429, data)
            .onPost(endpoint, body)
            .replyOnce(429, data)
            .onPost(endpoint, body)
            .replyOnce(429, data);

          await expect(
            coordinator
              .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
              .request()
          ).to.be.rejectedWith('Exceeded rate limit');
        });

        it('should return response on second retry', async () => {
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
            filterBy: [
              {
                path: '/_meta/hierarchy/parentId',
                value: '121313-13131-131313',
              },
            ],
          };

          mocks
            .onPost(endpoint, body)
            .replyOnce(429, data)
            .onPost(endpoint, body)
            .reply(200, NO_RESULTS);

          const request = await coordinator
            .filterByParentId('121313-13131-131313')
            .request();

          expect(request.responses).to.deep.equals(NO_RESULTS.responses);
          expect(request.page.responseCount).to.equals(0);
        });
      }
    });
  });
});
