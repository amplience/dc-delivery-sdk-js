import { expect } from 'chai';
import { ContentLifecycle } from './ContentLifecycle';

describe('ContentLifecycle', () => {
  context('isExpired', () => {
    it('should return false if expiryTime is not defined', () => {
      expect(new ContentLifecycle().isExpired()).to.be.false;
    });

    it('should return false if expiryTime is after currentTime', () => {
      const meta = new ContentLifecycle({
        expiryTime: '2019-01-22T20:25:12.508Z',
      });
      expect(meta.isExpired(new Date(1548188712507))).to.be.false;
    });

    it('should return true if expiryTime is before currentTime', () => {
      const meta = new ContentLifecycle({
        expiryTime: '2019-01-22T20:25:12.508Z',
      });
      expect(meta.isExpired(new Date(1548188712509))).to.be.true;
    });
  });
});
