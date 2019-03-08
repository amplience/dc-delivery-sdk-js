/* tslint:disable */

/**
 * @hidden
 */
const NO_RESULTS = {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api',
  '@type': 'QueryResult',
  result: [],
  '@graph': []
};

/**
 * @hidden
 */
const SINGLE_RESULT = {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api',
  '@type': 'QueryResult',
  result: [
    {
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ],
  '@graph': [
    {
      _meta: {
        name: 'name',
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
      },
      '@type':
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ]
};

/**
 * @hidden
 */
const SINGLE_LEGACY_RESULT = {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api',
  '@type': 'QueryResult',
  result: [
    {
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ],
  '@graph': [
    {
      _title: 'Title',
      '@type':
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ]
};

/**
 * @hidden
 */
const SINGLE_RESULT_WITH_IMAGE = {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api',
  '@type': 'QueryResult',
  result: [
    {
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ],
  '@graph': [
    {
      _meta: {
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
      },
      image: {
        '@id':
          'http://image.cms.amplience.com/ddf4eac9-7822-401c-97d6-b1be985e421c'
      },
      '@type':
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    },
    {
      _meta: {
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
      },
      id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
      name: 'shutterstock_749703970',
      endpoint: 'dcdemo',
      defaultHost: 'i1.adis.ws',
      '@id':
        'http://image.cms.amplience.com/ddf4eac9-7822-401c-97d6-b1be985e421c',
      mediaType: 'image'
    }
  ]
};

/**
 * @hidden
 */
const SINGLE_LEGACY_RESULT_WITH_IMAGE = {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api',
  '@type': 'QueryResult',
  result: [
    {
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ],
  '@graph': [
    {
      _meta: {
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
      },
      image: {
        '@id':
          'http://image.cms.amplience.com/ddf4eac9-7822-401c-97d6-b1be985e421c'
      },
      '@type':
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    },
    {
      name: 'shutterstock_749703970',
      endpoint: 'dcdemo',
      defaultHost: 'i1.adis.ws',
      '@id':
        'http://image.cms.amplience.com/ddf4eac9-7822-401c-97d6-b1be985e421c',
      mediaType: 'image'
    }
  ]
};

/**
 * @hidden
 */
const NESTED_CONTENT = {
  '@context': 'http://context.system.cms.amplience.com/v0.0/api',
  '@type': 'QueryResult',
  result: [
    {
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    }
  ],
  '@graph': [
    {
      _meta: {
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json'
      },
      contentSlots: [
        {
          '@id':
            'http://content.cms.amplience.com/286f3e8e-f088-4956-92c6-a196d7e16c4e',
          '@type':
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/blocks/image-block.json'
        }
      ],
      '@type':
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/containers/page.json',
      '@id':
        'http://content.cms.amplience.com/2c7efa09-7e31-4503-8d00-5a150ff82f17'
    },
    {
      _meta: {
        schema:
          'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/blocks/image-block.json',
        name: 'fathers-day-pre-sale'
      },
      image: {
        '@id':
          'http://image.cms.amplience.com/ddf4eac9-7822-401c-97d6-b1be985e421c'
      },
      mobileAspectRatio: {
        w: 1,
        h: 1,
        _meta: {
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/mixins/aspect-ratio.json'
        }
      },
      aspectRatio: {
        w: 5,
        h: 2,
        _meta: {
          schema:
            'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/mixins/aspect-ratio.json'
        }
      },
      '@type':
        'https://raw.githubusercontent.com/techiedarren/dc-examples/master/content-types/blocks/image-block.json',
      '@id':
        'http://content.cms.amplience.com/286f3e8e-f088-4956-92c6-a196d7e16c4e'
    },
    {
      _meta: {
        schema:
          'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
      },
      id: 'ddf4eac9-7822-401c-97d6-b1be985e421c',
      name: 'shutterstock_749703970',
      endpoint: 'dcdemo',
      defaultHost: 'i1.adis.ws',
      '@id':
        'http://image.cms.amplience.com/ddf4eac9-7822-401c-97d6-b1be985e421c',
      mediaType: 'image'
    }
  ]
};

export {
  NO_RESULTS,
  SINGLE_RESULT,
  SINGLE_RESULT_WITH_IMAGE,
  SINGLE_LEGACY_RESULT_WITH_IMAGE,
  SINGLE_LEGACY_RESULT,
  NESTED_CONTENT
};
