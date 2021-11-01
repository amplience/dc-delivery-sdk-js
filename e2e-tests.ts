import { ContentClient } from './build/main/index';

const CONTENT_ID = '4cef6e46-95a3-48a6-8202-e31871eaaa72' as const;
const CONTENT_KEY = 'welcome-to-the-amplience-product-blog' as const;
const EXPECTED_KEYS = ['schema', 'deliveryId', 'deliveryKey'] as const;
const cd1Client = new ContentClient({
  account: 'ampproduct',
});

const cd2Client = new ContentClient({
  hubName: 'productblog',
});

const cd2FreshClient = new ContentClient({
  hubName: 'productblog',
  apiKey: 'aEoErhSGEj736mbMl6bd98lzNjk8HweV6jVskqE0',
});

function assertContentItemStructure(contentItem) {
  const allKeysPresent = EXPECTED_KEYS.every(
    (key) =>
      contentItem?._meta[key] && typeof contentItem?._meta[key] === 'string'
  );
  if (!allKeysPresent) {
    throw new Error('Content item does not contain expected _meta properties');
  }
}

(async function () {
  const cd1ContentById = await cd1Client.getContentItemById(CONTENT_ID);
  const cd2ContentById = await cd2Client.getContentItemById(CONTENT_ID);
  const cd2ContentByKey = await cd2Client.getContentItemByKey(CONTENT_KEY);
  const cd2FreshContentById = await cd2FreshClient.getContentItemById(
    CONTENT_ID
  );
  const cd2FreshContentByKey = await cd2FreshClient.getContentItemByKey(
    CONTENT_KEY
  );

  try {
    assertContentItemStructure(cd1ContentById.toJSON());
    assertContentItemStructure(cd2ContentById.toJSON());
    assertContentItemStructure(cd2ContentByKey.toJSON());
    assertContentItemStructure(cd2FreshContentById.toJSON());
    assertContentItemStructure(cd2FreshContentByKey.toJSON());
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log('\n🎉 All e2e tests passed 🎉\n');
})();
