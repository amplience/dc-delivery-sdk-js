import { HierarchyURLBuilder } from './GetHierarchy';
import { HierarchyRequest } from '../model/ByHierachy';
import { expect, use } from 'chai';
import * as ROOT from './__fixtures__/v2/hierarchies/ROOT.json';
import * as SINGLE_LAYER_RESPONSE from './__fixtures__/v2/hierarchies/SINGLE_LAYER_RESPONSE.json';
import * as SINGLE_LAYER_RESULT from './__fixtures__/v2/hierarchies/SINGLE_LAYER_RESULT.json';
import * as MULTI_LAYER_RESPONSE from './__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE.json';
import * as MULTI_LAYER_RESPONSE_P1 from './__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE_P1.json';
import * as MULTI_LAYER_RESPONSE_P2 from './__fixtures__/v2/hierarchies/MULTI_LAYER_RESPONSE_P2.json';
import * as MULTI_LAYER_RESULT from './__fixtures__/v2/hierarchies/MULTI_LAYER_RESULT.json';
import chaiAsPromised from 'chai-as-promised';
import { ContentItem } from '../model/ContentItem';
import { ContentBody, DefaultContentBody } from '../model/ContentBody';
import MockAdapter from 'axios-mock-adapter';
import { createContentClient } from '../../client/createContentClient';
import { GetHierarchyImpl } from './GetHierarchyImpl';
import { HierarchyAssemblerImpl } from '../assemblers/HierarchyAssemblerImpl';

use(chaiAsPromised);
const contentRoot: ContentItem = new ContentItem<DefaultContentBody>();
const urlBuilder: HierarchyURLBuilder = new HierarchyURLBuilder();

contentRoot.body = JSON.parse(JSON.stringify(ROOT.content));

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

function createCoordinator<T extends ContentBody>(
  config: any
): [MockAdapter, GetHierarchyImpl<T>] {
  const mocks = new MockAdapter(null);
  const mergedConfig = { ...config, adaptor: mocks.adapter() };
  const client = createContentClient(mergedConfig);
  const coordinator = new GetHierarchyImpl<T>(
    client,
    new HierarchyAssemblerImpl()
  );
  return [mocks, coordinator];
}

describe('getByHierarchies', () => {
  describe('Url building tests', () => {
    it('Url should be constructed properly', () => {
      const hierachyURL: HierarchyURLBuilder = new HierarchyURLBuilder();
      const request: HierarchyRequest = {
        rootId: 'testId',
        maximumPageSize: 5,
        maximumDepth: 3,
      };
      const result = hierachyURL.buildUrl(request);
      expect(result).to.deep.eq(
        '/content/hierarchies/descendants/id/testId?hierarchyDepth=3&maxPageSize=5'
      );
    }),
      it('Url should be constructed properly with cursor key', () => {
        const hierachyURL: HierarchyURLBuilder = new HierarchyURLBuilder();
        const request: HierarchyRequest = {
          rootId: 'testId',
          maximumPageSize: 5,
          maximumDepth: 3,
          pageCursor: 'LEKEY',
        };
        const result = hierachyURL.buildUrl(request);
        expect(result).to.deep.eq(
          '/content/hierarchies/descendants/id/testId?hierarchyDepth=3&maxPageSize=5&pageCursor=LEKEY'
        );
      });

    it('Url should be constructed properly without max depth', () => {
      const hierachyURL: HierarchyURLBuilder = new HierarchyURLBuilder();
      const request: HierarchyRequest = {
        rootId: 'testId',
        maximumPageSize: 5,
      };
      const result = hierachyURL.buildUrl(request);
      expect(result).to.deep.eq(
        '/content/hierarchies/descendants/id/testId?maxPageSize=5'
      );
    }),
      it('Url should be constructed properly without max page size', () => {
        const hierachyURL: HierarchyURLBuilder = new HierarchyURLBuilder();
        const request: HierarchyRequest = {
          rootId: 'testId',
          maximumDepth: 5,
        };
        const result = hierachyURL.buildUrl(request);
        expect(result).to.deep.eq(
          '/content/hierarchies/descendants/id/testId?hierarchyDepth=5'
        );
      }),
      it('Url should be constructed properly with just cursor', () => {
        const hierachyURL: HierarchyURLBuilder = new HierarchyURLBuilder();
        const request: HierarchyRequest = {
          rootId: 'testId',
          pageCursor: 'LEKEY',
        };
        const result = hierachyURL.buildUrl(request);
        expect(result).to.deep.eq(
          '/content/hierarchies/descendants/id/testId?pageCursor=LEKEY'
        );
      });
  });

  describe('Should correctly retrieve and build flat hierarchies', () => {
    runs.forEach(({ name, config, host }) => {
      it(`${name}`, async () => {
        const [mocks, coordinator] = createCoordinator({
          ...config,
        });
        mocks
          .onGet(
            host +
              HierarchyURLBuilder.HIERARCHY_URL +
              contentRoot.body._meta.deliveryId
          )
          .replyOnce(200, SINGLE_LAYER_RESPONSE);

        const result = await coordinator.getHierarchyByRoot(
          { rootId: contentRoot.body._meta.deliveryId },
          contentRoot
        );
        expect(result.content).to.deep.eq(SINGLE_LAYER_RESULT.content);
        expect(result.children).to.deep.eq(SINGLE_LAYER_RESULT.children);
      });
    });
  });
  describe('Should correctly retrieve and build multi-layer hierarchies', () => {
    runs.forEach(({ name, config, host }) => {
      it(`${name}`, async () => {
        const [mocks, coordinator] = createCoordinator({
          ...config,
        });
        mocks
          .onGet(
            host +
              HierarchyURLBuilder.HIERARCHY_URL +
              contentRoot.body._meta.deliveryId
          )
          .replyOnce(200, MULTI_LAYER_RESPONSE);

        const result = await coordinator.getHierarchyByRoot(
          { rootId: contentRoot.body._meta.deliveryId },
          contentRoot
        );
        expect(result.content).to.deep.eq(MULTI_LAYER_RESULT.content);
        expect(result.children).to.deep.eq(MULTI_LAYER_RESULT.children);
      });
    });
  });
  describe('Should correctly retrieve and build multi-layer hierarchies over multiple pages', () => {
    runs.forEach(({ name, config, host }) => {
      it(`${name}`, async () => {
        const [mocks, coordinator] = createCoordinator({
          ...config,
        });
        mocks
          .onGet(
            host +
              urlBuilder.buildUrl({
                rootId: contentRoot.body._meta.deliveryId,
              })
          )
          .replyOnce(200, MULTI_LAYER_RESPONSE_P1);

        mocks
          .onGet(
            host +
              urlBuilder.buildUrl({
                rootId: contentRoot.body._meta.deliveryId,
                pageCursor: 'testCursor',
              })
          )
          .replyOnce(200, MULTI_LAYER_RESPONSE_P2);

        const result = await coordinator.getHierarchyByRoot(
          { rootId: contentRoot.body._meta.deliveryId },
          contentRoot
        );
        expect(result.content).to.deep.eq(MULTI_LAYER_RESULT.content);
        expect(result.children).to.deep.eq(MULTI_LAYER_RESULT.children);
      });
    });
  });
});
