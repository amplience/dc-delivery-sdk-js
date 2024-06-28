import MockAdapter from 'axios-mock-adapter';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as STANDARD_RESPONSE from './__fixtures__/v2/hierarchies/descendants/id/STANDARD_RESPONSE.json';
import { createContentClient } from '../../client/createContentClient';
import { HierarchyDescendantsById } from './HierarchyDescendants';

use(chaiAsPromised);

function createCoordinator<T = any>(
  config: any
): [MockAdapter, HierarchyDescendantsById<T>] {
  const mocks = new MockAdapter(null);
  const mergedConfig = { ...config, adaptor: mocks.adapter() };
  const client = createContentClient(mergedConfig);
  const coordinator = new HierarchyDescendantsById<T>(client);
  return [mocks, coordinator];
}

const cd2RunConfig = {
  name: 'cdv2',
  type: 'cdn',
  endpoint:
    'https://hub.cdn.content.amplience.net/content/hierarchies/descendants/id/90d6fa96-6ce0-4332-b995-4e6c50b1e233',
  config: { hubName: 'hub' },
};

const runs = [cd2RunConfig];

describe(`Hierarchy Descendants by id`, () => {
  runs.forEach(({ name, endpoint, config }) => {
    describe(`${name}`, () => {
      it('should reconstruct a hierarchy', async () => {
        interface PropertyName1Body {
          label: string;
        }

        const [mocks, coordinator] = createCoordinator<PropertyName1Body>(
          config
        );
        mocks.onGet(endpoint).reply(200, STANDARD_RESPONSE);

        const response = await coordinator
          .descendantsById('90d6fa96-6ce0-4332-b995-4e6c50b1e233')
          .request();

        expect(response.responses).to.deep.equals(STANDARD_RESPONSE.responses);

        const rootNode = response.asTree();

        const expectedLabelToId = {
          A: '1ebab07d-acd8-4e19-a614-ec632cdf95d5',
          B: '4db37251-0c86-4f45-ad8a-583ebf6efc80',
          C: '68676cda-5ab2-4a5e-bcfb-58c5cf3eb8ed',
          D: '07039c54-68f2-405e-bb6e-d8afccb66be3',
          E: 'bf3bd6ea-840a-4b52-80bb-5f84cd0de237',
          F: 'bb258971-8932-42ca-8c4f-fe75ae20ffc4',
          G: '2a14e75d-6ffc-4610-b748-934b8d226829',
          H: 'e51aedf7-b804-4e93-866c-849fcd029cb5',
          I: 'e1510389-bb6b-4551-a85b-d52cf6263458',
          J: 'ca97e6ac-6997-42a1-9a00-e62f0ebfcf10',
          K: 'e8877c0f-c33f-49d3-b8b8-b36050d879a9',
          L: '72ba743a-d1ef-4d61-bdee-5c49a1063562',
          M: '124bc7a2-3f5b-4232-8108-34ed015a9cf5',
          N: '0020dc4c-9e2b-4de0-8ceb-3a9bd7fd5e05',
          O: '6dff02d9-0949-4bd9-8504-7771417f9745',
          P: 'bceae570-49ef-46e6-9c96-58a4405e6b4c',
          Q: '9ae6257f-92a1-4634-9f31-f3448c6bc816',
          R: 'fc3e924a-2b6b-48e3-b5f6-0760217d4992',
          S: '17995812-47c2-48c9-9fe8-f891ab857fdd',
          T: 'af5f7379-8dc3-40e4-8dfc-ee2f247be214',
        };

        const expectedTreeStructure = {
          root: ['A', 'B', 'C'],
          A: ['D', 'E'],
          D: ['I', 'J'],
          B: ['F', 'G'],
          G: ['L', 'M'],
          C: ['H'],
          H: ['N', 'O'],
          O: ['P'],
          P: ['Q', 'R'],
          R: ['S'],
          S: ['T'],
        };

        for (const item in expectedTreeStructure) {
          const node =
            item === 'root'
              ? rootNode
              : rootNode.findById(expectedLabelToId[item]);

          const expectedChildren = expectedTreeStructure[item];

          expect(node.children.map((x) => x.content.label)).to.deep.equal(
            expectedChildren
          );
        }
      });
    });
  });
});
