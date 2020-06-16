import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { RenderContentItem } from './RenderContentItem';

function createCoordinator(
  accountName: string,
  locale?: string
): [MockAdapter, RenderContentItem] {
  const mocks = new MockAdapter(null);

  const config = {
    account: accountName,
    adaptor: mocks.adapter(),
    locale: locale,
  };
  const client = new RenderContentItem(config);
  return [mocks, client];
}

describe('RenderContentItem', () => {
  let mocks: MockAdapter;
  let coordinator: RenderContentItem;

  beforeEach(() => {
    [mocks, coordinator] = createCoordinator('test');
  });

  it('should reject if content is not found', (done) => {
    const response = coordinator.renderContentItem(
      '629c7260-9442-4095-b1c7-763a344e2225',
      'mapping'
    );
    expect(response).to.eventually.rejected.and.notify(done);
  });

  it('should resolve if content and template are found', () => {
    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping'
      )
      .reply(200, '<h1>Test</h1>');

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping')
      .then((response) => {
        expect(response).to.deep.eq({
          body: '<h1>Test</h1>',
        });
      });
  });

  it('should resolve with lifecycle meta data', () => {
    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping'
      )
      .reply(200, '<h1>Test</h1>', {
        'X-Amp-Lifecycle-Expiry-Time': '2019-01-22T20:25:12.508Z',
      });

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping')
      .then((response) => {
        expect(response.body).to.eq('<h1>Test</h1>');
        expect(response.lifecycle.expiryTime).to.eq('2019-01-22T20:25:12.508Z');
      });
  });

  it('should resolve with edition meta data', () => {
    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping'
      )
      .reply(200, '<h1>Test</h1>', {
        'X-Amp-Edition-ID': '5c40e6724cedfd0001467592',
        'X-Amp-Edition-Start-Time': '2019-01-17T20:36:13.508Z',
        'X-Amp-Edition-End-Time': '2019-01-22T20:25:12.508Z',
      });

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping')
      .then((response) => {
        expect(response.body).to.eq('<h1>Test</h1>');
        expect(response.edition.id).to.eq('5c40e6724cedfd0001467592');
        expect(response.edition.start).to.eq('2019-01-17T20:36:13.508Z');
        expect(response.edition.end).to.eq('2019-01-22T20:25:12.508Z');
      });
  });

  it('should send custom parameters in query string', () => {
    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping&crparam.key1=value1&crparam.key2=value2'
      )
      .reply(200, '<h1>Test</h1>');

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping', {
        key1: 'value1',
        key2: 'value2',
      })
      .then((response) => {
        expect(response).to.deep.eq({
          body: '<h1>Test</h1>',
        });
      });
  });

  it('should url encode template name', () => {
    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping%20template'
      )
      .reply(200, '<h1>Test</h1>');

    return coordinator
      .renderContentItem(
        '629c7260-9442-4095-b1c7-763a344e2225',
        'mapping template'
      )
      .then((response) => {
        expect(response).to.deep.eq({
          body: '<h1>Test</h1>',
        });
      });
  });

  it('should url encode account name', () => {
    [mocks, coordinator] = createCoordinator('test account');
    mocks
      .onGet(
        '/v1/content/test%20account/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping'
      )
      .reply(200, '<h1>Test</h1>');

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping')
      .then((response) => {
        expect(response).to.deep.eq({
          body: '<h1>Test</h1>',
        });
      });
  });

  it('should url encode custom parameters', () => {
    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping&crparam.email=user%40website.com'
      )
      .reply(200, '<h1>Test</h1>');

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping', {
        email: 'user@website.com',
      })
      .then((response) => {
        expect(response).to.deep.eq({
          body: '<h1>Test</h1>',
        });
      });
  });

  it('should url encode locale if provided', () => {
    [mocks, coordinator] = createCoordinator('test', 'en-GB');

    mocks
      .onGet(
        '/v1/content/test/content-item/629c7260-9442-4095-b1c7-763a344e2225?template=mapping&crparam.email=user%40website.com&locale=en-GB'
      )
      .reply(200, '<h1>Test</h1>');

    return coordinator
      .renderContentItem('629c7260-9442-4095-b1c7-763a344e2225', 'mapping', {
        email: 'user@website.com',
      })
      .then((response) => {
        expect(response).to.deep.eq({
          body: '<h1>Test</h1>',
        });
      });
  });
});
