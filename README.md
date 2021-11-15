[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

# dc-delivery-sdk-js

> Official Javascript SDK for the Amplience Dynamic Content Delivery API

[![npm version](https://badge.fury.io/js/dc-delivery-sdk-js.svg)](https://badge.fury.io/js/dc-delivery-sdk-js)

This SDK is designed to help build client side and server side content managed applications.

## Features

- Fetch content and slots using [Content Delivery 1](https://docs.amplience.net/integration/deliveryapi.html#the-content-delivery-api) or [Content Delivery 2](https://docs.amplience.net/development/contentdelivery/readme.html)
- Fetch fresh content and slots for use with SSG build tools using the [Fresh API](https://amplience.com/docs/development/freshapi/fresh-api.html)
- Fetch preview content using Virtual Staging
- Transform content using the [Content Rendering Service](https://docs.amplience.net/integration/contentrenderingservice.html#the-content-rendering-service)
- Localize content
- Transform images on the fly using the [Dynamic Media Service](http://playground.amplience.com/di/app/#/intro)
- Filter Content Items using the [FilterBy](https://amplience.com/docs/development/contentdelivery/filterandsort.html) endpoint

So we can have nice things:

- ES6 module & tree-shaking support for tools capable of using [ES6 imports](https://github.com/rollup/rollup/wiki/pkg.module) (like [Rollup](http://rollupjs.org/), [Webpack](https://webpack.js.org/), or [Parcel](https://parceljs.org/))
- Backwards compatibility for Node.js-style (CommonJS) imports
- TypeScript type definitions
- Universal Module Definition (UMD) to support direct use in the browser

## Installation

Using npm:

```sh
npm install dc-delivery-sdk-js --save
```

Using cdn:

```html
<script src="https://unpkg.com/dc-delivery-sdk-js/dist/dynamicContent.browser.umd.min.js"></script>
```

for legacy browsers:

```html
<script src="https://unpkg.com/dc-delivery-sdk-js/dist/dynamicContent.browser.umd.legacy.min.js"></script>
```

## Usage

This SDK supports browser and Node.js applications using ES6 or CommonJS style imports.

ES6:

```js
import { ContentClient } from 'dc-delivery-sdk-js';

const client = new ContentClient({
  hubName: 'myhub',
});
```

CommonJS:

```js
const ContentClient = require('dc-delivery-sdk-js').ContentClient;

const client = new ContentClient({
  hubName: 'myhub',
});
```

If your application does not use a package manager you can directly include the pre-bundled version of the SDK and access the features using the global "ampDynamicContent".

```html
<script src="https://unpkg.com/dc-delivery-sdk-js/dist/dynamicContent.browser.umd.min.js"></script>
```

```js
const client = new ampDynamicContent.ContentClient({
  hubName: 'myhub',
});
```

If you need to support old browsers a legacy version of the bundle is provided, however we strongly recommend using a tool like [babel](https://babeljs.io/) in your project to compile the SDK to your exact browser requirements.

### Configuration options

| Option             | Description                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| account            | Content Delivery 1 API - Required\* - Account to retrieve content from                                                                                                      |
| hubName            | Content Delivery 2 API - Required\* - hubName to retrieve content from - [finding the hub name](https://docs.amplience.net/development/contentdelivery/readme.html#hubname) |
| apiKey             | Fresh API - Required\* - API key required for use with the Fresh API service. `hubName` must also be set                                                                    |
| retryConfig        | Allows override of the default [retry configuration](#override-fresh-api-retry-configuration) used by the Fresh API client                                                  |
| stagingEnvironment | If set, the SDK will request content and media from the staging environment host name specified.                                                                            |
| locale             | If set, the SDK will request content using the locale settings provided.                                                                                                    |
| mediaHost          | Allows users with custom hostnames to override the hostname used when constructing media URLs.                                                                              |
| secureMediaHost    | Allows users with custom hostnames to override the hostname used when constructing secure media URLs.                                                                       |
| baseUrl            | Override for the content delivery API base URL                                                                                                                              |
| adaptor            | Allows custom handling of requests which makes testing and supporting non-standard environments easier.                                                                     |
| timeout            | If set, requests made will timeout after the number of milliseconds specified.                                                                                              |

\* see [Content Delivery versions](#content-delivery-versions)

### Content Delivery versions

In order to use the client, it must be configured with either `account` or `hubName`. If `apiKey` is set a Fresh API client will be created.

If **account** & **hubName** are supplied, the SDK will only use the **Content Delivery 2 API**.
If **hubName** and **apiKey** are supplied, the SDK will only use the **Fresh API**.

To create a Fresh API client both `hubName` and `apiToken` must be specified

### Fetch content by delivery ID

Once your client is created you can request content for a slot or content item id. This will return a promise which will resolve to the JSON of your slot or content item. If no content is found with the provided id the promise will reject with an error.

```js
const slotId = 'cb671f37-0a66-46c3-a011-54ce3cdff241';
client
  .getContentItemById(slotId)
  .then((content) => {
    console.log(content.body);
  })
  .catch((error) => {
    console.log('content not found', error);
  });
```

The format of the content object will be specific to your content types, which define the JSON structure of content items and slots, however a set of standard metadata is always included in a property called "\_meta".

If the slot or content item requested returns a graph of content, for example a carousel may also return linked slides, these will be included inline in the JSON.

Example:

```json
{
  "_meta": {
    "schema": "https://www.anyafinn.online/content-types/carousel.json",
    "deliveryId": "543246b7-5948-4849-884c-b295402a95b4",
    "name": "example-carousel"
  },
  "slides": [
    {
      "_meta": {
        "schema": "https://www.anyafinn.online/content-types/slide.json",
        "deliveryId": "d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
        "name": "example-slide"
      },
      "heading": "Free shipping until Sunday!"
    }
  ]
}
```

### Fetch content by delivery key _(Content Delivery 2 and Fresh API only)_

**Note:** Fetching content by delivery key via `getContentItemByKey()` is only supported when using [Content Delivery 2 or Fresh API](#content-delivery-versions)

Once you have [set a delivery key for a slot or content item](https://docs.amplience.net/development/delivery-keys/readme.html), the content item must be published before it can be retrieved using this SDK.

The `getContentItemByKey()` method will return a promise which will resolve to the JSON of your slot or content item. If no content is found with the provided key the promise will reject with an error.

```js
const client = new ContentClient({
  hubName: 'myhub',
});

const slot = 'homepage-banner-slot';
client
  .getContentItemByKey(slot)
  .then((content) => {
    console.log(content.body);
  })
  .catch((error) => {
    console.log('content not found', error);
  });
```

The format of the content object will be specific to your content types, which define the JSON structure of content items and slots, however a set of standard metadata is always included in a property called "\_meta" along with the `deliveryKey` on content items that have it defined.

If the slot or content item requested returns a graph of content, for example a carousel may also return linked slides, these will be included inline in the JSON.

The delivery key

Example:

```json
{
  "_meta": {
    "schema": "https://www.anyafinn.online/content-types/carousel.json",
    "deliveryId": "543246b7-5948-4849-884c-b295402a95b4",
    "deliveryKey": "homepage-banner-slot",
    "name": "example-carousel"
  },
  "slides": [
    {
      "_meta": {
        "schema": "https://www.anyafinn.online/content-types/slide.json",
        "deliveryId": "d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
        "name": "example-slide"
      },
      "heading": "Free shipping until Sunday!"
    }
  ]
}
```

### Filtering Content Items

**Note:** Filtering content via `filterBy() | filterByContentType() | filterByParentId() | filterContentItems()` is only supported when using [Content Delivery 2 or Fresh API](#content-delivery-versions).

Filtering by Content Type or Parent ID is enabled by default. You can also filter by any other field in your schema once [you enable it](https://amplience.com/docs/development/contentdelivery/filterandsort.html).

#### Constructing a request

The `filterBy() | filterByContentType() | filterByParentId()` method will return a instance of the `FilterBy` class which has helper functions to construct a filterBy request.

`filterByContentType() | filterByParentId()` are helper methods.

```ts
client.filterByContentType('https://bigcontent.io/blog.json');
// is equivalent to this:
client.filterBy('/_meta/schema', 'https://bigcontent.io/blog.json');

client.filterByParentId('c6d9e038-591b-4ca2-874b-da354f5d6e61');
// is equivalent to this:
client.filterBy(
  '/_meta/hierarchy/parentId',
  'c6d9e038-591b-4ca2-874b-da354f5d6e61'
);
```

Calling `request` executes the request returning a `Promise` if no content is found an empty response object will be returned. If invalid options are provided it will reject with an error.

```ts
const client = new ContentClient({
  hubName: 'myhub',
});

const res = await client
  .filterByContentType('https://example.com/blog-post-filter-and-sort')
  .filterBy('/category', 'Homewares')
  .sortBy('readTime', 'DESC')
  .page(2)
  .request({
    format: 'inlined',
    depth: 'all',
  });

console.log(res);
```

The response from `filterBy() | filterByContentType() | filterByParentId() | filterContentItems()` will match the API response but with an added helper function if the next page is available under `page.next()`.

```js
{
  responses: [
    {
      content: {
        _meta: {
          name: 'Homewares blog post',
          schema: 'https://example.com/blog-post-filter-and-sort',
          deliveryKey: 'new/homeware-collection/about',
          deliveryId: '1024dc7a-f255-46a7-b374-be85081a562f',
        },
        title: 'All about our new homeware collection',
        category: 'Homewares',
        date: '2021-05-05',
        ranking: 4,
        description:
          'Our new homeware has just landed. Find out how you can fill your home with some exciting designs.',
        readTime: 5,
      },
    },
    {
      content: {
        _meta: {
          name: 'Summer collection blog',
          schema: 'https://example.com/blog-post-filter-and-sort',
          deliveryKey: 'new/summer-fashion/about',
          deliveryId: 'fb466729-b604-496f-be36-521013a752d2',
        },
        title: 'Our new summer collection blog',
        category: 'Homewares',
        date: '2021-05-05',
        ranking: 2,
        description: 'A sneak peak at our new summer collection',
        readTime: 4,
      },
    },
  ],
  page: {
    responseCount: 2,
    next: () => // next page
    nextCursor:
      'eyJzb3J0S2V5IjoiXCIgNUAmJTYwOTJiZjBhNGNlZGZkMDAwMWVhZTY3ZCIsIml0ZW1JZCI6ImFtcHByb2R1Y3QtZG9jOjg2Y2E2YjgxLTJkOGYtNDRiMi1iNGQ1LTFlZjU0MzgzMzMyMyJ9',
  },
}
```

#### Alternative constructing a filterBy request

We also provide a way of requesting by a request object which is identical to the the request above

```ts
const client = new ContentClient({
  hubName: 'myhub',
});

const res = await client.filterContentItems({
  filterBy: [
    {
      path: '/_meta/schema',
      value: 'https://example.com/blog-post-filter-and-sort',
    },
    {
      path: '/category',
      value: 'Homewares',
    },
  ],
  sortBy: {
    key: 'readTime',
    order: 'DESC',
  },
  page: {
    size: 2,
  },
  parameters: {
    format: 'inlined',
    depth: 'all',
  },
});

console.log(res);
```

### Fetching multiple Content Items or Slots in a single request

**Note:** Fetching content via `getContentItemsById() | getContentItemsByKey() | getContentItems() | fetchContentItems()` is only supported when using [Content Delivery 2 or Fresh API](#content-delivery-versions).

Wraps [`/content/fetch`](https://amplience.com/docs/api/dynamic-content/delivery/content-delivery-2/index.html#operation/multiGetContent) endpoint. [Additional documentation](https://amplience.com/docs/development/contentdelivery/readme.html#multipleitems).

#### Get content items by delivery ID

Fetch multiple by delivery id e.g.,

```ts
client.getContentItemsById([
  'd6ccc158-6ab7-48d0-aa85-d9fbf2aef000',
  'b322f84a-9719-42ff-a6a0-6e2924608d19',
]);
```

#### Get content items by key

Fetch multiple by delivery key e.g.,

```ts
client.getContentItemsByKey(['blog/article-1', 'blog/article-2']);
```

#### Get content items

Less verbose version of `fetchContentItems` allowing fetching of content by both delivery keys and ids as well as per request parameters and global parameter overrides

```ts
client.getContentItems([{
  key: 'blog/article-1', overrides: {locale: 'en-US'}
  key: 'blog/article-2'
}], {locale: 'en'});
```

#### Fetch content items

Allows full construction of the request body.

```ts
client.fetchContentItems({
  requests: [{
    key: 'blog/article-1', overrides: {locale: 'en'}
    key: 'blog/article-2'
  }],
  parameters: {depth: 'root'}
});
```

### Preview staging content

By default, the content client will request content from the production content delivery services. When a user wants to preview content before it is published you can re-point the client to a virtual staging environment (VSE):

```js
const client = new ContentClient({
  account: 'myaccount',
  stagingEnvironment: 'fhboh562c3tx1844c2ycknz96.staging.bigcontent.io',
});
```

Dynamic Content generates a VSE for each user and typically passes the "stagingEnvironment" value into your application using a URL parameter. This allows each user to effectively have their own staging environment which allows content producers to work in parallel.

#### Previewing staging content for a given Snapshot or at a given point in time (time machine)

You can use the `StagingEnvironmentFactory` to generate a new staging environment that is 'pinned' to a Snapshot or a timestamp, which then can be passed into the ContentClient.

Previewing content for a given Snapshot:

```js
const factory = new StagingEnvironmentFactory(
  'fhboh562c3tx1844c2ycknz96.staging.bigcontent.io'
);
const stagingEnvironmentAtSnapshot = await factory.generateDomain({
  snapshotId: 'abcdef123456',
});

const client = new ContentClient({
  account: 'myaccount',
  stagingEnvironment: stagingEnvironmentAtSnapshot,
});
```

Previewing content at a given timestamp (epoch milliseconds):

```js
const factory = new StagingEnvironmentFactory(
  'fhboh562c3tx1844c2ycknz96.staging.bigcontent.io'
);
const stagingEnvironmentAtTimestamp = await factory.generateDomain({
  timestamp: 1546264721816,
});

const client = new ContentClient({
  account: 'myaccount',
  stagingEnvironment: stagingEnvironmentAtTimestamp,
});
```

### Localize content

Content types can make use of [field-level localization](https://docs.amplience.net/production/localization.html#field-level-localization) to give content producers the ability to enter locale specific values for a field.

By default, every locale value will be returned in the content object:

```json
{
  "_meta": {
    "schema": "https://www.anyafinn.online/content-types/slide.json",
    "deliveryId": "d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
    "name": "example-slide"
  },
  "heading": {
    "_meta": {
      "schema": "http://bigcontent.io/cms/schema/v1/core#/definitions/localized-value"
    },
    "values": [
      {
        "locale": "en-US",
        "value": "Free shipping until Sunday!"
      },
      {
        "locale": "de-de",
        "value": "Kostenloser Versand bis Sonntag!"
      }
    ]
  }
}
```

If desired, you can configure the SDK with a locale query. If set, the locale matching is performed server side and only a single value will be returned.

```js
const client = new ContentClient({
  account: 'myaccount',
  locale: 'en-US,en-*',
});
```

Returns

```json
{
  "_meta": {
    "schema": "https://www.anyafinn.online/content-types/slide.json",
    "deliveryId": "d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
    "name": "example-slide"
  },
  "heading": "Free shipping until Sunday!"
}
```

### Transform images

In addition to serving image and Video content, Dynamic Content can also transform media on the fly allowing you to target multiple channels and deliver just the pixels required from a single master asset.

The SDK attaches helper functions to Image and Video properties to simplify constructing Dynamic Media URLs:

```js
const ImageFormat = require('dc-delivery-sdk-js').ImageFormat;

const imageUrl = content.body.imageProperty
  .url()
  .width(500)
  .height(500)
  .sharpen()
  .format(ImageFormat.WEBP)
  .build();
```

See the SDK [reference documentation](https://amplience.github.io/dc-delivery-sdk-js/) for further details.

### Transform content

Using the [Content Rendering Service](https://docs.amplience.net/integration/contentrenderingservice.html#the-content-rendering-service), you can convert the JSON content into any format you choose by applying a template previously setup in the back-office. This is typically used to convert content into fragments of HTML, XML or even rewrite the JSON.

```js
client
  .renderContentItem('b322f84a-9719-42ff-a6a0-6e2924608d19', 'templateName')
  .then((response) => {
    console.log(response.body);
  })
  .catch((error) => {
    console.log('unable to find content', error);
  });
```

## Advanced

### Override Fresh API retry configuration

By default, if a 429 status code is received the SDK will retry up to 3 more times using exponential backoff. The configuration options below may be overridden.

| Name           | Type       | Default            | Description                                                                                                                                                                                                                                                                                              |
| -------------- | ---------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| retries        | `Number`   | `3`                | The number of times to retry before failing.                                                                                                                                                                                                                                                             |
| retryDelay     | `Function` | `exponentialDelay` | A callback to further control the delay in milliseconds between retried requests. By default there is an exponential delay between retries ([Exponential Backoff](https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff)). The function is passed `retryCount` and `error`. |
| retryCondition | `Function` | `isThrottled`      | A callback to further control if a request should be retried. By default, it retries if the response status is 429.                                                                                                                                                                                      |

### Detecting content types

When displaying content you may need to detect the content type to decide which UI widget should be used to display the content.

Every content item in the body includes a built-in property \_meta.schema which identifies the content type that was used to create that fragment of content. This can be used by your application to influence how the content is processed.

Example:

```json
{
  "_meta": {
    "schema": "https://www.anyafinn.online/content-types/slot.json",
    "deliveryId": "62ece7d6-b541-411c-b776-0a6704ede1fb",
    "name": "homepage-hero"
  },
  "slotContent": {
    "_meta": {
      "schema": "https://www.anyafinn.online/content-types/banner.json",
      "deliveryId": "28583572-c964-4755-825b-044718312a29",
      "name": "example-banner"
    },
    "heading": "Free shipping until Sunday!"
  }
}
```

```js
import React from 'react';
import { Banner, Carousel, Empty } from './components';

class App extends React.Component {
  //...

  getComponentForContentType(contentItem) {
    switch (contentItem._meta.schema) {
      case 'https://www.anyafinn.online/content-types/banner.json':
        return Banner;
      case 'https://www.anyafinn.online/content-types/carousel.json':
        return Carousel;
      default:
        return Empty;
    }
  }

  render() {
    const slotContent = this.props.content.slotContent;
    const TagName = this.getComponentForContentType(slotContent);
    return <TagName content={slotContent} />;
  }
}
```

### Strongly typed content

Applications that support TypeScript can optionally create interfaces to represent content types within the code. This can be passed as a generic parameter when loading content which will result in a typed content body.

```typescript
interface Banner extends ContentBody {
  heading: string;
}

client.getContentItem<Banner>('ec5d12cc-b1bb-4df4-a7b3-fd7796326cfe');
```

```ts
interface BlogPost {
  title: string;
  category: string;
  date: string;
  ranking: number;
  description: string;
  readTime: number;
}

const res = await client
  .filterByContentType<BlogPost>(
    'https://example.com/blog-post-filter-and-sort'
  )
  .request();

console.log(res);
```

### Custom media CNAMEs

If you have previously configured custom CNAMEs for your media hosting, you can override the hostname used by the SDK when constructing image URLs as shown below:

```js
const client = new ContentClient({
  account: 'myaccount',
  mediaHost: 'images.mybrand.com',
  secureMediaHost: 'images.mybrand.com',
});
```

## Documentation

Please use the following documentation resources to assist building your application:

- Dynamic Content SDK [Reference documentation](https://amplience.github.io/dc-delivery-sdk-js/)
- Dynamic Content Delivery API [Reference documentation](https://docs.amplience.net/integration/deliveryapi.html#the-content-delivery-api)
- Dynamic Content Delivery API 2 [Reference documentation](https://amplience.com/docs/development/contentdelivery/readme.html)
- Dynamic Content Fresh API [Reference documentation](https://amplience.com/docs/development/contentdelivery/filterapiintro.html)
- Dynamic Content [User guide](https://docs.amplience.net/)

## Getting Help

If you need help using the SDK please reach out using one of the following channels:

- Ask a question on [StackOverflow](https://stackoverflow.com/) using the tag `amplience-dynamic-content`
- Open a support ticket with [Amplience Support](https://support.amplience.com/)
- Contact your [Amplience Customer Success](https://amplience.com/customer-success) representative
- If you have found a bug please report it by [opening an issue](https://github.com/amplience/dc-delivery-sdk-js/issues/new)

## License

This software is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),

Copyright 2019-2021 Amplience

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
