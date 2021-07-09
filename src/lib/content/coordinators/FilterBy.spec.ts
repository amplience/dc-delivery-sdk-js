import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as NO_RESULTS from './__fixtures__/filterBy/NO_RESULTS.json';
import * as PAGED_RESPONSE from './__fixtures__/filterBy/PAGED_RESPONSE.json';

import { FilterBy } from './FilterBy';

use(chaiAsPromised);

function createCoordinator<T = any>(
  hubName: string,
  locale?: string
): [MockAdapter, FilterBy<T>] {
  const mocks = new MockAdapter(null);

  const config = { hubName, adaptor: mocks.adapter(), locale };

  const client = new FilterBy<T>(config);
  return [mocks, client];
}

describe('FilterBy', () => {
  it('should return no items response if no items found', async () => {
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
        filterBy: [
          {
            path: '/_meta/parentId',
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
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test', 'en-GB');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test', 'en-GB');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
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
    const error = {
      error: {
        type: 'REQUEST_PROPERTY_VALUE_INVALID',
        message: 'Invalid property value in request body',
        data: { key: 'depth', value: 'sasdsd' },
      },
    };

    const [mocks, coordinator] = createCoordinator('test');
    mocks
      .onPost('https://test.cdn.content.amplience.net/content/filter', {
        filterBy: [
          {
            path: '/_meta/schema',
            value: 'https://filter-by-sort-by.com',
          },
        ],
      })
      .reply(400, error);

    expect(
      coordinator
        .filterBy('/_meta/schema', 'https://filter-by-sort-by.com')
        .request()
    ).to.eventually.throw(`Invalid property value in request body`);
  });
});
