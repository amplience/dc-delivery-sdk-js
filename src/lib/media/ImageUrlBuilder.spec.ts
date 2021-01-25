import { expect } from 'chai';
import { ImageUrlBuilder } from './ImageUrlBuilder';
import { Image } from './Image';
import { ImageFormat } from './model/ImageFormat';
import { CommonContentClientConfig } from '../config/CommonContentClientConfig';

const config: CommonContentClientConfig = {};

describe('ImageUrlBuilder', () => {
  context('protocol', () => {
    it('should default to https protocol', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image'
      );
    });

    it('should support http protocol', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      builder.protocol('http');
      expect(builder.build()).to.eq(
        'http://cdn.media.amplience.net/i/test/image'
      );
    });

    it('should support protocol relative protocol', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      builder.protocol('//');
      expect(builder.build()).to.eq('//cdn.media.amplience.net/i/test/image');
    });
  });

  context('host', () => {
    it('should use defaultHost by default for secure URLs', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image'
      );
    });
    it('should use defaultHost by default for insecure URLs', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      builder.protocol('http');
      expect(builder.build()).to.eq(
        'http://cdn.media.amplience.net/i/test/image'
      );
    });
    it('should use override host if set', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      builder.host('overridehost.com');
      expect(builder.build()).to.eq('https://overridehost.com/i/test/image');
    });
    it('should use staging environment if set for http urls', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          stagingEnvironment:
            'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io',
        }
      );

      const builder = new ImageUrlBuilder(image);
      builder.protocol('http');
      expect(builder.build()).to.eq(
        'http://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io/i/test/image'
      );
    });
    it('should use staging environment if set for https urls', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          stagingEnvironment:
            'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io',
        }
      );

      const builder = new ImageUrlBuilder(image);
      builder.protocol('https');
      expect(builder.build()).to.eq(
        'https://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io/i/test/image'
      );
    });

    it('should use staging environment when custom media hosts are set', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          stagingEnvironment:
            'fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io',
          mediaHost: 'invalid.adis.ws',
          secureMediaHost: 'invalid.adis.ws',
        }
      );

      const builder = new ImageUrlBuilder(image);
      builder.protocol('https');
      expect(builder.build()).to.eq(
        'https://fhboh562c3tx1844c2ycknz96-gvzrfgnzc-1546264721816.staging.bigcontent.io/i/test/image'
      );
    });

    it('should use mediaHost for http urls', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          mediaHost: 'images.mywebsite.com',
        }
      );

      const builder = new ImageUrlBuilder(image);

      builder.protocol('http');
      expect(builder.build()).to.eq('http://images.mywebsite.com/i/test/image');
    });
    it('should not use mediaHost for https urls', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          mediaHost: 'images.mywebsite.com',
        }
      );

      const builder = new ImageUrlBuilder(image);

      builder.protocol('https');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image'
      );
    });
    it('should use secureMediaHost for https urls', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          secureMediaHost: 'images.mywebsite.com',
        }
      );

      const builder = new ImageUrlBuilder(image);

      builder.protocol('https');
      expect(builder.build()).to.eq(
        'https://images.mywebsite.com/i/test/image'
      );
    });

    it('should use secureMediaHost for http urls if mediaHost is not provided', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        {
          ...config,
          secureMediaHost: 'images.mywebsite.com',
        }
      );

      const builder = new ImageUrlBuilder(image);

      builder.protocol('http');
      expect(builder.build()).to.eq('http://images.mywebsite.com/i/test/image');
    });
  });

  context('account name', () => {
    it('should encode account name', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test ',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );

      const builder = new ImageUrlBuilder(image);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test%20/image'
      );
    });
  });

  context('image name', () => {
    it('should encode image name', () => {
      const image = new Image(
        {
          name: 'image ',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image%20'
      );
    });
  });

  context('format', () => {
    it('should output format as a file extension', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.format(ImageFormat.WEBP);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image.webp'
      );
    });
  });

  context('seoFileName', () => {
    it('should output seoFileName', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.seoFileName('seo');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image/seo'
      );
    });

    it('should encode seoFileName', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.seoFileName('seo ');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image/seo%20'
      );
    });

    it('should append format to seoFileName', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.seoFileName('seo');
      builder.format(ImageFormat.JPEG);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image/seo.jpg'
      );
    });
  });

  context('template', () => {
    it('should append template to query string', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.template('thumb');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?$thumb$'
      );
    });

    it('should encode template name', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.template('thumb ');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?$thumb%20$'
      );
    });

    it('should output templates in the order they were added', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.template('thumb');
      builder.template('poi');

      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?$thumb$&$poi$'
      );
    });
  });

  context('parameter', () => {
    it('should append parameter to query string', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.parameter('offers', '241');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?offers=241'
      );
    });

    it('should encode parameter name and value', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.parameter('offers ', '241 ');
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?offers%20=241%20'
      );
    });
  });

  context('quality', () => {
    it('should append quality to query string', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.quality(70);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?qlt=70'
      );
    });
  });

  context('sharpen', () => {
    it('should append unsharp to query string', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.sharpen(0, 1, 1, 0.05);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?unsharp=0,1,1,0.05'
      );
    });
  });

  context('width', () => {
    it('should append width to query string', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.width(100);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?w=100'
      );
    });
  });

  context('height', () => {
    it('should append height to query string', () => {
      const image = new Image(
        {
          name: 'image',
          endpoint: 'test',
          defaultHost: 'cdn.media.amplience.net',
        },
        config
      );
      const builder = new ImageUrlBuilder(image);
      builder.height(100);
      expect(builder.build()).to.eq(
        'https://cdn.media.amplience.net/i/test/image?h=100'
      );
    });
  });
});
