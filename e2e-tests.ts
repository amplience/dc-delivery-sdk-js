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

  try {
    assertContentItemStructure(cd1ContentById.toJSON());
    assertContentItemStructure(cd2ContentById.toJSON());
    assertContentItemStructure(cd2ContentByKey.toJSON());
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log('\n🎉 All e2e tests passed 🎉\n');
})();
