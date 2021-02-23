import { expect } from 'chai';
import { HttpError } from './HttpError';

describe('HttpError', () => {
  it('should extract the error message from known error formats', () => {
    const literalString = new HttpError(404, 'Not Found');

    expect(literalString.status).to.eq(404);
    expect(literalString.data).to.eq('Not Found');
    expect(literalString.message).to.eq('Not Found');

    const errorObject = {
      error: {
        message: 'Nested Error Message',
      },
    };

    const nestedString = new HttpError(500, errorObject);

    expect(nestedString.status).to.eq(500);
    expect(nestedString.data).to.eq(errorObject);
    expect(nestedString.message).to.eq('Nested Error Message');

    const unknownObject = {
      unknownError: 'test',
    };

    const stringify = new HttpError(300, unknownObject);

    expect(stringify.status).to.eq(300);
    expect(stringify.data).to.eq(unknownObject);
    expect(stringify.message).to.eq('{"unknownError":"test"}');
  });

  it('should use the provided message when applicable', () => {
    const literalString = new HttpError(404, 'Not Found', 'Custom Message');

    expect(literalString.status).to.eq(404);
    expect(literalString.data).to.eq('Not Found');
    expect(literalString.message).to.eq('Custom Message');
  });
});
