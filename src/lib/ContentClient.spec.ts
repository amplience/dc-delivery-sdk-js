import { expect } from 'chai';
import {
  ContentClient,
  ContentClientConfigV2,
  ContentItem,
  ContentMeta,
  DefaultContentBody,
  HierarchyContentItem,
} from '../index';
import MockAdapter from 'axios-mock-adapter';
import * as V1_SINGLE_RESULT from './content/coordinators/__fixtures__/v1/SINGLE_RESULT.json';
import * as V2_SINGLE_RESULT from './content/coordinators/__fixtures__/v2/SINGLE_RESULT.json';
import * as NO_RESULTS from './content/coordinators/__fixtures__/v2/filterBy/NO_RESULTS.json';
import * as MULTI_LAYER_RESPONSE from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE.json';
import * as MULTI_LAYER_RESPONSE_ALT_SORT from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE_ALT_SORT.json';
import * as MULTI_LAYER_RESPONSE_DESC from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE_DESC.json';
import * as MULTI_LAYER_RESPONSE_DESC_KEY from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE_DESC_KEY.json';
import * as MULTI_LAYER_RESULT_DESC from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT_DESC.json';
import * as MULTI_LAYER_RESULT_DESC_KEY from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT_DESC_KEY.json';
import * as MULTI_LAYER_RESULT_FILTERED from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT_FILTERED.json';
import * as MULTI_LAYER_RESULT_FILTERED_AND_MUTATED from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT_FILTER_AND_MUTATE.json';
import * as MULTI_LAYER_RESULT_MUTATED from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT_MUTATED.json';
import * as MULTI_LAYER_RESULT from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT.json';
import * as MULTI_LAYER_RESULT_ALT_SORT from './content/coordinators/__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT_ALT_SORT.json';
import * as ROOT from './content/coordinators/__fixtures__/v2/hierarchies/ROOT.json';

import { ContentClientConfigV1 } from './config/ContentClientConfigV1';
import { FilterBy } from './content/coordinators/FilterBy';
import { HierarchyURLBuilder } from './content/coordinators/GetByHierarchy/UrlBuilder';
import Axios from 'axios';
import { IFilterBy } from './content/model/FilterBy';

const SINGLE_ITEM_RESPONSE = {
  _meta: {
    deliveryId: '2c7efa09-7e31-4503-8d00-5a150ff82f17',
    name: 'name',
    schema:
      'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
  },
  string: 'value',
  number: 123,
  bool: true,
  null: null,
  object: {
    string: 'value',
    number: 123,
    bool: true,
    null: null,
  },
  array: [
    {
      object: {
        string: 'value',
        number: 123,
        bool: true,
        null: null,
      },
    },
  ],
};

describe('ContentClient', () => {
  context('configuration', () => {
    it('should throw if config is not provided', () => {
      expect(() => new ContentClient(null)).to.throw(
        'Parameter "config" is required'
      );
    });

    it('should throw if config.account is not provided', () => {
      expect(
        () => new ContentClient(({} as unknown) as ContentClientConfigV1)
      ).to.throw('Parameter "config" must contain a valid "account" name');
    });

    it('should throw if config.stagingEnvironment is a URL', () => {
      expect(
        () =>
          new ContentClient({
            account: 'test',
            stagingEnvironment: 'http://staging.com',
          })
      ).to.throw(
        'Parameter "stagingEnvironment" should be a hostname not a URL'
      );
    });

    it('should throw if config.account is empty', () => {
      expect(() => new ContentClient({ account: '' })).to.throw(
        'Parameter "config" must contain a valid "account" name'
      );
    });
  });

  context('getContentItem', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://cdn.c1.amplience.net/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
          )
          .reply(200, V1_SINGLE_RESULT);

        const client = new ContentClient({
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '2c7efa09-7e31-4503-8d00-5a150ff82f17'
        );

        expect(response.toJSON()).to.deep.eq(SINGLE_ITEM_RESPONSE);
      });
    });
    context('ContentClientConfigV2', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
    context('ContentClientConfigV2Fresh', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItem(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
  });

  context('getContentItemById', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://cdn.c1.amplience.net/cms/content/query?query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F2c7efa09-7e31-4503-8d00-5a150ff82f17%22%7D&fullBodyObject=true&scope=tree&store=test'
          )
          .reply(200, V1_SINGLE_RESULT);

        const client = new ContentClient({
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '2c7efa09-7e31-4503-8d00-5a150ff82f17'
        );

        expect(response.toJSON()).to.deep.eq(SINGLE_ITEM_RESPONSE);
      });
    });
    context('ContentClientConfigV2', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });

      it('should resolve use v2 if account was supplied', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          account: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
    context('ContentClientConfigV2Fresh', () => {
      it('should resolve use v2 if account was supplied', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          account: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/id/0bf85aa1-9386-4068-adad-6b9a813f5ddb?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemById(
          '0bf85aa1-9386-4068-adad-6b9a813f5ddb'
        );

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
  });

  context('getContentItemByKey', () => {
    context('ContentClientConfigV1', () => {
      it('should resolve if content item is found', async () => {
        const client = new ContentClient({
          account: 'test',
        });

        expect(() => client.getContentItemByKey('content-key')).to.throw(
          'Not supported. You need to define "hubName" configuration property to use getContentItemByKey()'
        );
      });
    });
    context('ContentClientConfigV2', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.cdn.content.amplience.net/content/key/welcome-para-1?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemByKey('welcome-para-1');

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
    context('ContentClientConfigV2Fresh', () => {
      it('should resolve if content item is found', async () => {
        const mocks = new MockAdapter(Axios.create());
        mocks
          .onGet(
            'https://test.fresh.content.amplience.net/content/key/welcome-para-1?depth=all&format=inlined'
          )
          .reply(200, V2_SINGLE_RESULT);

        const client = new ContentClient({
          hubName: 'test',
          apiKey: 'test-key',
          adaptor: mocks.adapter(),
        });

        const response = await client.getContentItemByKey('welcome-para-1');

        expect(response.toJSON()).to.deep.eq(V2_SINGLE_RESULT['content']);
      });
    });
  });

  context('filterBy', () => {
    it('`filterBy` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterBy('something', 'http://bigcontent.io/schema').request()
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterBy()'
      );
    });

    it('`filterByContentType` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterByContentType('http://bigcontent.io/schema').request()
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterByContentType()'
      );
    });

    it('`filterByContentType` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterContentItems({
          filterBy: [],
        })
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterContentItems()'
      );
    });

    it('`filterByParentId` should throw if no cdv2 configuration', () => {
      const client = new ContentClient({
        account: 'test',
      });

      expect(() =>
        client.filterByParentId('1213123-12312-31231231').request()
      ).to.throw(
        'Not supported. You need to define "hubName" configuration property to use filterByParentId()'
      );
    });

    it('`filterBy` should return `FilterBy` class if valid configuration', () => {
      const client = new ContentClient({
        account: 'test',
        hubName: 'test',
      });

      expect(
        client.filterBy('something', 'http://bigcontent.io/schema')
      ).to.instanceOf(FilterBy);
    });

    it('`filterByContentType`  should return `FilterBy` class if valid configuration', () => {
      const client = new ContentClient({
        hubName: 'test',
        account: 'test',
      });

      expect(
        client.filterByContentType('http://bigcontent.io/schema')
      ).to.be.instanceOf(FilterBy);
    });

    it('`filterByParentId`  should return `FilterBy` class if valid configuration', () => {
      const client = new ContentClient({
        account: 'test',
        hubName: 'test',
      });

      expect(
        client.filterByParentId('1213123-12312-31231231')
      ).to.be.instanceOf(FilterBy);
    });

    it('`filterByContentType` should throw if no cdv2 configuration', async () => {
      const mocks = new MockAdapter(Axios.create());
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

      const client = new ContentClient({
        account: 'test',
        hubName: 'test',
        adaptor: mocks.adapter(),
      });
      const filter: IFilterBy = {
        path: '/_meta/schema',
        value: 'https://filter-by-sort-by.com',
      };

      const request = await client.filterContentItems({
        filterBy: [filter],
      });

      expect(request.responses).to.deep.equals(NO_RESULTS.responses);
      expect(request.page.responseCount).to.equals(0);
    });
  });

  it(`getByHierarchy should fetch root item if it isn't passed in`, async () => {
    const urlBuilder = new HierarchyURLBuilder();

    const mocks = new MockAdapter(Axios.create());

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(MULTI_LAYER_RESULT.content._meta),
      propertyName1: MULTI_LAYER_RESULT.content.propertyName1,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(200, ROOT);

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          urlBuilder.buildUrl({
            rootId: ROOT.content._meta.deliveryId,
            deliveryType: 'id',
          })
      )
      .reply(200, MULTI_LAYER_RESPONSE);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getByHierarchy({
      rootId: ROOT.content._meta.deliveryId,
    });
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it(`getByHierarchy should sort correctly`, async () => {
    const urlBuilder = new HierarchyURLBuilder();

    const mocks = new MockAdapter(Axios.create());

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(MULTI_LAYER_RESULT_DESC.content._meta),
      propertyName1: MULTI_LAYER_RESULT_DESC.content.propertyName1,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT_DESC.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(200, ROOT);

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          urlBuilder.buildUrl({
            rootId: ROOT.content._meta.deliveryId,
            sortOrder: 'DESC',
            deliveryType: 'id',
          })
      )
      .reply(200, MULTI_LAYER_RESPONSE_DESC);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getByHierarchy({
      rootId: ROOT.content._meta.deliveryId,
      sortOrder: 'DESC',
    });
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it(`getByHierarchy should apply custom sorts`, async () => {
    const urlBuilder = new HierarchyURLBuilder();

    const mocks = new MockAdapter(Axios.create());

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(MULTI_LAYER_RESULT_ALT_SORT.content._meta),
      propertyName1: MULTI_LAYER_RESULT_ALT_SORT.content.propertyName1,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT_ALT_SORT.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(200, ROOT);

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          urlBuilder.buildUrl({
            rootId: ROOT.content._meta.deliveryId,
            sortKey: '_meta/deliveryId',
            deliveryType: 'id',
          })
      )
      .reply(200, MULTI_LAYER_RESPONSE_ALT_SORT);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getByHierarchy({
      rootId: ROOT.content._meta.deliveryId,
      sortKey: '_meta/deliveryId',
    });
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it(`getByHierarchy should apply filter when building a tree with a filter`, async () => {
    const urlBuilder = new HierarchyURLBuilder();

    const mocks = new MockAdapter(Axios.create());

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(MULTI_LAYER_RESULT.content._meta),
      propertyName1: MULTI_LAYER_RESULT.content.propertyName1,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT_FILTERED.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(200, ROOT);

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          urlBuilder.buildUrl({
            rootId: ROOT.content._meta.deliveryId,
            deliveryType: 'id',
          })
      )
      .reply(200, MULTI_LAYER_RESPONSE);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getByHierarchyAndFilter(
      {
        rootId: ROOT.content._meta.deliveryId,
      },
      (contentBody) => {
        return contentBody['propertyName1'] === 'C';
      }
    );
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it(`getByHierarchy should apply a mutation when building a tree with a mutator`, async () => {
    const urlBuilder = new HierarchyURLBuilder();

    const mocks = new MockAdapter(Axios.create());

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(MULTI_LAYER_RESULT_MUTATED.content._meta),
      propertyName1: MULTI_LAYER_RESULT_MUTATED.content.propertyName1,
      mutatedId: MULTI_LAYER_RESULT_MUTATED.content.mutatedId,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT_MUTATED.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(200, ROOT);

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          urlBuilder.buildUrl({
            rootId: ROOT.content._meta.deliveryId,
            deliveryType: 'id',
          })
      )
      .reply(200, MULTI_LAYER_RESPONSE);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getByHierarchyAndMutate(
      {
        rootId: ROOT.content._meta.deliveryId,
      },
      (contentBody) => {
        contentBody['mutatedId'] = contentBody._meta.deliveryId;
        return contentBody;
      }
    );
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it(`getByHierarchy should apply a filter and mutation when building a tree with a mutator`, async () => {
    const mocks = new MockAdapter(Axios.create());

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(
        MULTI_LAYER_RESULT_FILTERED_AND_MUTATED.content._meta
      ),
      propertyName1:
        MULTI_LAYER_RESULT_FILTERED_AND_MUTATED.content.propertyName1,
      mutatedId: MULTI_LAYER_RESULT_FILTERED_AND_MUTATED.content.mutatedId,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT_FILTERED_AND_MUTATED.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(200, ROOT);

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          '/content/hierarchies/descendants/id/' +
          ROOT.content._meta.deliveryId
      )
      .reply(200, MULTI_LAYER_RESPONSE);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getByHierarchyFilterAndMutate(
      {
        rootId: ROOT.content._meta.deliveryId,
      },
      (contentBody) => {
        return contentBody['propertyName1'] === 'C';
      },
      (contentBody) => {
        contentBody['mutatedId'] = contentBody._meta.deliveryId;
        return contentBody;
      }
    );
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it(`getByHierarchy should throw an error if the root item is not found`, async () => {
    const mocks = new MockAdapter(Axios.create());

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        'https://hub.cdn.content.amplience.net/content/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233?depth=all&format=inlined'
      )
      .reply(404);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    await client
      .getByHierarchy({ rootId: ROOT.content._meta.deliveryId })
      .catch((error) => {
        expect(error.message).to.deep.eq(
          'Error while retrieving hierarchy root item: Content item "90d6fa96-6ce0-4332-b995-4e6c50b1e233" was not found'
        );
      });
  });

  it(`getByHierarchy should throw an error if the root item id does not match the request rootId`, async () => {
    const mocks = new MockAdapter(Axios.create());

    const rootBody: DefaultContentBody = {
      _meta: new ContentMeta(ROOT.content._meta),
      propertyName1: ROOT.content.propertyName1,
    };

    const rootItem = new ContentItem();
    rootItem.body = rootBody;

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    await client
      .getByHierarchy({ rootId: 'failed test', rootItem: rootItem })
      .catch((error) => {
        expect(error.message).to.deep.eq(
          'The root item id(90d6fa96-6ce0-4332-b995-4e6c50b1e233) does not match the request rootId(failed test)'
        );
      });
  });

  it(`getHierarchyByKey should be handled in the same fashion as by id`, async () => {
    const urlBuilder = new HierarchyURLBuilder();

    const mocks = new MockAdapter(Axios.create());
    const rootBody: DefaultContentBody = {
      _meta: new ContentMeta(ROOT.content._meta),
      propertyName1: ROOT.content.propertyName1,
    };

    const rootItem = new ContentItem();
    rootItem.body = rootBody;
    rootItem.body._meta.deliveryKey = 'test';

    const expectedBody: DefaultContentBody = {
      _meta: new ContentMeta(MULTI_LAYER_RESULT_DESC_KEY.content._meta),
      propertyName1: MULTI_LAYER_RESULT_DESC_KEY.content.propertyName1,
    };

    const expectedContent: HierarchyContentItem<DefaultContentBody> = {
      content: expectedBody,
      children: MULTI_LAYER_RESULT_DESC_KEY.children as any,
    };

    const cd2RunConfig = {
      name: 'cdv2',
      hubName: 'hub',
      type: 'cdn',
      baseUrl: 'https://hub.cdn.content.amplience.net',
      config: { hubName: 'hub' },
    } as ContentClientConfigV2;

    mocks
      .onGet(
        cd2RunConfig.baseUrl +
          urlBuilder.buildUrl({
            rootId: 'test',
            sortOrder: 'DESC',
            deliveryType: 'key',
          })
      )
      .reply(200, MULTI_LAYER_RESPONSE_DESC_KEY);

    const mergedConfig = { adaptor: mocks.adapter(), ...cd2RunConfig };

    const client = new ContentClient(mergedConfig);
    const response = await client.getHierarchyByKey({
      rootKey: 'test',
      sortOrder: 'DESC',
      rootItem: rootItem,
    });
    expect(response).to.deep.eq(JSON.parse(JSON.stringify(expectedContent)));
  });

  it('`getByHierarchy` should throw if no cdv2 configuration', async () => {
    const client = new ContentClient({
      account: 'test',
    });

    await client.getByHierarchy({ rootId: 'ffff' }).catch((reason) => {
      expect(reason.message).to.deep.eq(
        'Not supported. You need to define "hubName" configuration property to use getByHierarchy()'
      );
    });
  });
});
