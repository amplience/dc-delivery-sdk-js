import { expect } from 'chai';
import { VseClient } from './VseClient';

describe('VseClient', () => {
  context('configuration', () => {
    it('should throw if config is not provided', () => {
      expect(() => new VseClient(null)).to.throw(
        'Parameter "config" is required'
      );
    });

    it('should throw if config.vseDomain is not provided', () => {
      expect(() => new VseClient(<any>{})).to.throw(
        'Parameter "config" must contain a valid "vseDomain"'
      );
    });

    it('should throw if config.vseDomain is empty', () => {
      expect(() => new VseClient({ vseDomain: '' })).to.throw(
        'Parameter "config" must contain a valid "vseDomain"'
      );
    });

    it('should throw if config.vseDomain is a fully qualified URL', () => {
      expect(
        () =>
          new VseClient({
            vseDomain: 'https://1dg9lsggokzjn1.staging.bigcontent.io'
          })
      ).to.throw('Parameter "config" must contain a valid "vseDomain"');
    });

    it('should use the baseUrl if provided', () => {
      const client = (<any>new VseClient({
        vseDomain: '1dg9lsggokzjn1.staging.bigcontent.io',
        baseUrl: 'https://localhost'
      })).vseClient;
      expect(client.defaults.baseURL).to.eq('https://localhost');
    });
  });
});
