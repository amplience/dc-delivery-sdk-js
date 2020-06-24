import { expect } from 'chai';
import { Edition } from './Edition';

describe('Edition', () => {
  context('constructor', () => {
    it('should parse inputs', () => {
      const edition = new Edition({
        id: '5b1a621ac9e77c0001b121b4',
        start: '2018-06-30T23:00:00.000Z',
        end: '2018-07-06T22:59:59.999Z',
      });

      expect(edition.id).to.eq('5b1a621ac9e77c0001b121b4');
      expect(edition.start).to.eq('2018-06-30T23:00:00.000Z');
      expect(edition.end).to.eq('2018-07-06T22:59:59.999Z');
    });

    it('should serialize to json', () => {
      const edition = new Edition({
        id: '5b1a621ac9e77c0001b121b4',
        start: '2018-06-30T23:00:00.000Z',
        end: '2018-07-06T22:59:59.999Z',
      });

      expect(JSON.parse(JSON.stringify(edition))).to.deep.eq({
        id: '5b1a621ac9e77c0001b121b4',
        start: '2018-06-30T23:00:00.000Z',
        end: '2018-07-06T22:59:59.999Z',
      });
    });
  });

  context('getStartDate', () => {
    it('should parse date', () => {
      const edition = new Edition({
        id: '5b1a621ac9e77c0001b121b4',
        start: '2018-06-30T23:00:00.000Z',
        end: '2018-07-06T22:59:59.999Z',
      });

      expect(edition.getStartDate().getTime()).to.eq(1530399600000);
    });
  });

  context('getEndDate', () => {
    it('should parse date', () => {
      const edition = new Edition({
        id: '5b1a621ac9e77c0001b121b4',
        start: '2018-06-30T23:00:00.000Z',
        end: '2018-07-06T22:59:59.999Z',
      });

      expect(edition.getEndDate().getTime()).to.eq(1530917999999);
    });
  });
});
