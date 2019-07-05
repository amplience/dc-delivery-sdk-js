
[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

# dc-delivery-sdk-js

> Official Javascript SDK for the Amplience Dynamic Content Delivery API

[![Build Status](https://travis-ci.org/amplience/dc-delivery-sdk-js.svg?branch=master)](https://travis-ci.org/amplience/dc-delivery-sdk-js)
[![npm version](https://badge.fury.io/js/dc-delivery-sdk-js.svg)](https://badge.fury.io/js/dc-delivery-sdk-js)

This sdk is designed to help build client side and server side content managed applications.

## Features

* Fetch content and slots using the [Content Delivery Service](https://docs.amplience.net/integration/deliveryapi.html#the-content-delivery-api)
* Fetch preview content using Virtual Staging
* Transform content using the [Content Rendering Service](https://docs.amplience.net/integration/contentrenderingservice.html#the-content-rendering-service)
* Localize content
* Transform images on the fly using the [Dynamic Media Service](http://playground.amplience.com/di/app/#/intro)

So we can have nice things:

* ES6 module & tree-shaking support for tools capable of using [ES6 imports](https://github.com/rollup/rollup/wiki/pkg.module) (like [Rollup](http://rollupjs.org/), [Webpack](https://webpack.js.org/), or [Parcel](https://parceljs.org/))
* Backwards compatibility for Node.js-style (CommonJS) imports
* TypeScript type definitions
* Universal Module Definition (UMD) to support direct use in the browser

## Installation

Using npm:

``` sh
npm install dc-delivery-sdk-js --save
```

Using cdn:

``` html
<script src="https://unpkg.com/dc-delivery-sdk-js/dist/dynamicContent.browser.umd.min.js"></script>
```

for legacy browsers:

``` html
<script src="https://unpkg.com/dc-delivery-sdk-js/dist/dynamicContent.browser.umd.legacy.min.js"></script>
```

## Usage

This sdk supports browser and node.js applications using ES6 or CommonJS style imports.

ES6:

```js
import { ContentClient } from 'dc-delivery-sdk-js';

const client = new ContentClient({
    account: 'myaccount'
});
```

CommonJS:

```js
var ContentClient = require('dc-delivery-sdk-js').ContentClient;

var client = new ContentClient({
    account: 'myaccount'
});
```

If your application does not use a package manager you can directly include the pre-bundled version of the sdk and access the features using the global "ampDynamicContent".

``` html
<script src="https://unpkg.com/dc-delivery-sdk-js/dist/dynamicContent.browser.umd.min.js"></script>
```

``` js
var client = new ampDynamicContent.ContentClient({
    account: 'myaccount'
});
```

If you need to support old browsers a legacy version of the bundle is provided, however we strongly recommend using a tool like [babel](https://babeljs.io/) in your project to compile the sdk to your exact browser requirements.

### Fetch content

Once your client is created you can request content for a slot or content item id. This will return a promise which will resolve to the JSON of your slot or content item. If no content is found with the provided id the promise will reject with an error.

```js
var slotId = 'cb671f37-0a66-46c3-a011-54ce3cdff241';
client.getContentItem(slotId)
    .then(content => {
        console.log(content.body);
    })
    .catch(error => {
        console.log('content not found', error);
    });
```

The format of the content object will be specific to your content types, which define the JSON structure of content items and slots, however a set of standard metadata is always included in a property called "_meta".

If the slot or content item requested returns a graph of content, for example a carousel may also return linked slides, these will be included inline in the JSON.

Example:

```json
{  
   "_meta":{  
      "schema":"https://www.anyafinn.online/content-types/carousel.json",
      "deliveryId":"543246b7-5948-4849-884c-b295402a95b4",
      "name":"example-carousel"
   },
   "slides": [
       {
           "_meta":{  
                "schema":"https://www.anyafinn.online/content-types/slide.json",
                "deliveryId":"d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
                "name":"example-slide"
            },
            "heading": "Free shipping until Sunday!"
       }
   ]
}
```

### Preview staging content

By default, the content client will request content from the production content delivery services. When a user wants to preview content before it is published you can repoint the client to a virtual staging environment (VSE):

```js
var client = new ContentClient({
    account: 'myaccount',
    stagingEnvironment: 'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io'
});
```

Dynamic Content generates a VSE for each user and typically passes the "stagingEnvironment" value into your application using a URL parameter. This allows each user to effectively have their own staging environment which allows content producers to work in parallel.

### Localize content

Content types can make use of [field-level localization](https://docs.amplience.net/production/localization.html#field-level-localization) to give content producers the ability to enter locale specific values for a field.

By default, every locale value will be returned in the content object:

```json
{
    "_meta":{  
        "schema":"https://www.anyafinn.online/content-types/slide.json",
        "deliveryId":"d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
        "name":"example-slide"
    },
    "heading": {
        "_meta":{  
            "schema":"http://bigcontent.io/cms/schema/v1/core#/definitions/localized-value"
        },
        "values":[  
            {  
                "locale":"en-US",
                "value":"Free shipping until Sunday!"
            },
            {
                "locale":"de-de",
                "value": "Kostenloser Versand bis Sonntag!"
            }
        ]
    }
}
```

If desired, you can configure the sdk with a locale query. If set, the locale matching is performed server side and only a single value will be returned.

```js
var client = new ContentClient({
    account: 'myaccount',
    locale: 'en-US,en-*'
});
```

Returns

```json
{
    "_meta":{  
        "schema":"https://www.anyafinn.online/content-types/slide.json",
        "deliveryId":"d6ccc158-6ab7-48d0-aa85-d9fbf2aef000",
        "name":"example-slide"
    },
    "heading": "Free shipping until Sunday!"
}
```

### Transform images

In addition to serving image and Video content, Dynamic Content can also transform media on the fly allowing you to target multiple channels and deliver just the pixels required from a single master asset.

The sdk attaches helper functions to Image and Video properties to simplify constructing Dynamic Media URLs:

```js
var ImageFormat = require('dc-delivery-sdk-js').ImageFormat;

var imageUrl = 
    content.body.imageProperty
        .url()
        .width(500)
        .height(500)
        .sharpen()
        .format(ImageFormat.WEBP)
        .build();
```

See the sdk [reference documentation](https://amplience.github.io/dc-delivery-sdk-js/) for further details.

### Transform content

Using the [Content Rendering Service](https://docs.amplience.net/integration/contentrenderingservice.html#the-content-rendering-service), you can convert the JSON content into any format you choose by applying a template previously setup in the back-office. This is typically used to convert content into fragments of HTML, XML or even rewrite the JSON.

```js
client.renderContentItem('b322f84a-9719-42ff-a6a0-6e2924608d19', 'templateName')
    .then(response => {
        console.log(response.body);
    })
    .catch(error => {
        console.log('unable to find content', error);
    });
```

## Advanced

### Detecting content types

When displaying content you may need to detect the content type to decide which UI widget should be used to display the content.

Every content item in the body includes a built-in property _meta.schema which identifies the content type that was used to create that fragment of content. This can be used by your application to influence how the content is processed.

Example:

```json
{  
   "_meta":{  
      "schema":"https://www.anyafinn.online/content-types/slot.json",
      "deliveryId":"62ece7d6-b541-411c-b776-0a6704ede1fb",
      "name":"homepage-hero"
   },
   "slotContent": {
        "_meta":{  
            "schema":"https://www.anyafinn.online/content-types/banner.json",
            "deliveryId":"28583572-c964-4755-825b-044718312a29",
            "name":"example-banner"
        },
        "heading": "Free shipping until Sunday!"
   }
}
```

```js
import React from 'react'
import { Banner, Carousel, Empty } from './components'

class App extends React.Component {
    //...

    getComponentForContentType(contentItem) {
        switch(contentItem._meta.schema) {
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
        return <TagName content={slotContent} />
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

### Custom media CNAMEs

If you have previously configured custom CNAMEs for your media hosting, you can override the hostname used by the sdk when constructing image URLs as shown below:

```js
var client = new ContentClient({
    account: 'myaccount',
    mediaHost: 'images.mybrand.com',
    secureMediaHost: 'images.mybrand.com'
});
```

### Configuration options

| Option             | Description                                                                                             |
|--------------------|---------------------------------------------------------------------------------------------------------|
| account            | Required: Account to retrieve content from.                                                             |
| stagingEnvironment | If set, the SDK will request content and media from the staging environment host name specified.        |
| locale             | If set, the SDK will request content using the locale settings provided.                                |
| mediaHost          | Allows users with custom hostnames to override the hostname used when constructing media URLs.          |
| secureMediaHost    | Allows users with custom hostnames to override the hostname used when constructing secure media URLs.   |
| baseUrl            | Override for the content delivery API base URL                                                          |
| adaptor            | Allows custom handling of requests which makes testing and supporting non-standard environments easier. |

## Documentation
Please use the following documentation resources to assist building your application:

* Dynamic Content SDK [Reference documentation](https://amplience.github.io/dc-delivery-sdk-js/)
* Dynamic Content Delivery API [Reference documentation](https://docs.amplience.net/integration/deliveryapi.html#the-content-delivery-api)
* Dynamic Content [User guide](https://docs.amplience.net/)

## Getting Help
If you need help using the sdk please reach out using one of the following channels:

* Ask a question on [StackOverflow](https://stackoverflow.com/) using the tag `amplience-dynamic-content`
* Open a support ticket with [Amplience Support](https://support.amplience.com/)
* Contact your [Amplience Customer Success](https://amplience.com/customer-success) representative
* If you have found a bug please report it by [opening an issue](https://github.com/amplience/dc-delivery-sdk-js/issues/new)

## License

This software is licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),

Copyright 2019 Amplience

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
