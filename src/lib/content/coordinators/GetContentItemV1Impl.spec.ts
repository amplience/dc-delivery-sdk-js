import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);
import { GetContentItemV1Impl } from './GetContentItemV1Impl';
import * as NO_RESULTS from './__fixtures__/v1/NO_RESULTS.json';
import * as SINGLE_RESULT from './__fixtures__/v1/SINGLE_RESULT.json';
import * as SINGLE_RESULT_WITH_IMAGE from './__fixtures__/v1/SINGLE_RESULT_WITH_IMAGE.json';
import * as SINGLE_LEGACY_RESULT_WITH_IMAGE from './__fixtures__/v1/SINGLE_LEGACY_RESULT_WITH_IMAGE.json';
import * as SINGLE_LEGACY_RESULT from './__fixtures__/v1/SINGLE_LEGACY_RESULT.json';
import * as SINGLE_CONTENT_REFERENCE from './__fixtures__/v1/SINGLE_CONTENT_REFERENCE.json';
import * as NESTED_CONTENT from './__fixtures__/v1/NESTED_CONTENT.json';
import { ContentMapper } from '../mapper/ContentMapper';
import { ContentMeta } from '../model/ContentMeta';
import { ContentNotFoundError } from '../model/ContentNotFoundError';

function createCoordinator(
  accountName: string,
  locale?: string
): [MockAdapter, GetContentItemV1Impl] {
  const mocks = new MockAdapter(null);
  const config = { account: accountName, adaptor: mocks.adapter(), locale };

  const client = new GetContentItemV1Impl(config, new ContentMapper(config));
  return [mocks, client];
}

describe('GetContentItemV1Impl', () => {
  context('getUrl', () => {
    it('should url encode account name', () => {
      const [, coordinator] = createCoordinator('test account');
      expect(coordinator.getUrl({})).to.contain('test%20account');
    });

    it('should JSON stringify query', () => {
      const [, coordinator] = createCoordinator('test');
      expect(
        coordinator.getUrl({
          'sys.iri':
            'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17',
        })
      ).to.eq(
        '/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
      );
    });

    it('should append locale if provided', () => {
      const [, coordinator] = createCoordinator('test', 'en-GB');
      expect(
        coordinator.getUrl({
          'sys.iri':
            'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17',
        })
      ).to.eq(
        '/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test&locale=en-GB'
      );
    });
  });

  context('processResponse', () => {
    const [, coordinator] = createCoordinator('test');

    it('should return an empty array if no results were found', () => {
      const contentItems = coordinator.processResponse(NO_RESULTS);
      expect(contentItems.length).to.eq(0);
    });

    it('should return content item from results', () => {
      const contentItems = coordinator.processResponse(SINGLE_RESULT);
      expect(contentItems.length).to.eq(1);
      expect(contentItems[0]).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          name: 'name',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
      });
    });

    it('should upgrade legacy content item', () => {
      const contentItems = coordinator.processResponse(SINGLE_LEGACY_RESULT);
      expect(contentItems.length).to.eq(1);
      expect(contentItems[0]).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          name: 'Title',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
        _title: 'Title',
      });
    });

    it('should inline media links', () => {
      const contentItems = coordinator.processResponse(
        SINGLE_RESULT_WITH_IMAGE
      );
      expect(contentItems.length).to.eq(1);
      expect(contentItems[0]).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
        image: {
          _meta: {
            schema:
              'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'dcdemo',
          id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
          mediaType: 'image',
          name: 'shutterstock_749703970',
        },
      });
    });

    it('should upgrade legacy media links', () => {
      const contentItems = coordinator.processResponse(
        SINGLE_LEGACY_RESULT_WITH_IMAGE
      );
      expect(contentItems.length).to.eq(1);
      expect(contentItems[0]).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
        image: {
          _meta: {
            schema:
              'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
          },
          defaultHost: 'cdn.media.amplience.net',
          endpoint: 'dcdemo',
          id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
          mediaType: 'image',
          name: 'shutterstock_749703970',
        },
      });
    });

    it('should inline content links', () => {
      const contentItems = coordinator.processResponse(NESTED_CONTENT);
      expect(contentItems.length).to.eq(1);

      expect(contentItems[0]).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
        contentSlots: [
          {
            _meta: {
              deliveryId: '286f3e8e-f088-4956-92c6-a196d7e16c4e',
              schema:
                'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/blocks/image-block.json',
              name: 'fathers-day-pre-sale',
            },
            image: {
              _meta: {
                schema:
                  'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
              },
              id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
              name: 'shutterstock_749703970',
              endpoint: 'dcdemo',
              defaultHost: 'cdn.media.amplience.net',
              mediaType: 'image',
            },
            content: {
              _meta: {
                deliveryId: '54cb30c7-e142-49d0-9e50-74f20c234452',
                name: 'content-reference',
                schema: 'http://content.ref',
              },
              contentRefExample: {
                _meta: {
                  schema:
                    'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference',
                },
                contentType: 'http://basic.example',
                id: 'de111147-1a23-47c6-aee1-4060dd570b3d',
              },
            },
            mobileAspectRatio: {
              w: 1,
              h: 1,
              _meta: {
                schema:
                  'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/mixins/aspect-ratio.json',
              },
            },
            aspectRatio: {
              w: 5,
              h: 2,
              _meta: {
                schema:
                  'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/mixins/aspect-ratio.json',
              },
            },
          },
        ],
      });
    });

    it('should attach content reference', () => {
      const contentItems = coordinator.processResponse(
        SINGLE_CONTENT_REFERENCE
      );
      expect(contentItems.length).to.eq(1);

      expect(contentItems[0]).to.deep.eq({
        _meta: {
          deliveryId: '54cb30c7-e142-49d0-9e50-74f20c234452',
          schema: 'http://content.ref',
        },
        contentRefExample: {
          _meta: {
            schema:
              'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference',
          },
          contentType: 'http://basic.example',
          id: 'de111147-1a23-47c6-aee1-4060dd570b3d',
        },
      });
    });
  });

  context('getContentItem', () => {
    let mocks: MockAdapter;
    let coordinator: GetContentItemV1Impl;

    beforeEach(() => {
      [mocks, coordinator] = createCoordinator('test');
    });

    it('should reject if content item not found', (done) => {
      mocks
        .onGet(
          '/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
        )
        .reply(200, NO_RESULTS);
      expect(coordinator.getContentItem('2c7efa09-7e31-4503-8d00-5a150ff82f17'))
        .to.eventually.rejectedWith(ContentNotFoundError)
        .and.notify(done);
    });

    it('should resolve if content item is found', async () => {
      mocks
        .onGet(
          '/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
        )
        .reply(200, SINGLE_RESULT);

      const response = await coordinator.getContentItem(
        '2c7efa09-7e31-4503-8d00-5a150ff82f17'
      );

      expect(response.toJSON()).to.deep.eq({
        _meta: {
          deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
          name: 'name',
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
        },
      });
    });

    it('should hydrate content items', () => {
      mocks
        .onGet(
          '/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
        )
        .reply(200, SINGLE_RESULT);

      return coordinator
        .getContentItem('2c7efa09-7e31-4503-8d00-5a150ff82f17')
        .then((response) => {
          expect(response.body._meta).to.be.instanceOf(ContentMeta);
        });
    });
  });
});
