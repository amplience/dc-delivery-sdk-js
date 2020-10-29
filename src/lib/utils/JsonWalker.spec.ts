import { expect } from 'chai';
import { walkAndReplace } from './JsonWalker';

describe('walkAndReplace', () => {
  it('should visit array children', () => {
    const data = ['a', 'b', 'c'];

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('/'));
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('/'));
        return value;
      },
    });

    expect(result).to.deep.eq(data);
    expect(before).to.deep.eq(['', '0', '1', '2']);
    expect(after).to.deep.eq(['0', '1', '2', '']);
  });

  it('should handle falsy values in arrays', () => {
    const data = [false, null, undefined];

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('-'));
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('-'));
        return value;
      },
    });

    expect(result).to.deep.eq(data);
    expect(before).to.deep.eq(['', '0', '1', '2']);
    expect(after).to.deep.eq(['0', '1', '2', '']);
  });

  it('should visit nested array children', () => {
    const data = [['a', 'b', 'c']];

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('/'));
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('/'));
        return value;
      },
    });

    expect(result).to.deep.eq(data);
    expect(before).to.deep.eq(['', '0', '0/0', '0/1', '0/2']);
    expect(after).to.deep.eq(['0/0', '0/1', '0/2', '0', '']);
  });

  it('should visit object children', () => {
    const data = { a: 1, b: 2, c: 3 };

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('/'));
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('/'));
        return value;
      },
    });

    expect(result).to.deep.eq(data);
    expect(before).to.deep.eq(['', 'a', 'b', 'c']);
    expect(after).to.deep.eq(['a', 'b', 'c', '']);
  });

  it('should handle falsy values in arrays', () => {
    const data = { a: false, b: null, c: undefined };

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('-'));
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('-'));
        return value;
      },
    });

    expect(result).to.deep.eq(data);
    expect(before).to.deep.eq(['', 'a', 'b', 'c']);
    expect(after).to.deep.eq(['a', 'b', 'c', '']);
  });

  it('should visit nested object children', () => {
    const data = { nested: { a: 1, b: 2, c: 3 } };

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('/'));
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('/'));
        return value;
      },
    });

    expect(result).to.deep.eq(data);
    expect(before).to.deep.eq([
      '',
      'nested',
      'nested/a',
      'nested/b',
      'nested/c',
    ]);
    expect(after).to.deep.eq([
      'nested/a',
      'nested/b',
      'nested/c',
      'nested',
      '',
    ]);
  });

  it('should replace array children before walk', () => {
    const data = [1, 2, 3];

    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        if (pointer.length > 0) {
          return 0 - value;
        }
        return value;
      },
    });

    expect(result).to.deep.eq([-1, -2, -3]);
  });

  it('should replace array children after walk', () => {
    const data = [1, 2, 3];

    const result = walkAndReplace(data, {
      afterWalk: (value: any, pointer: string[]) => {
        if (pointer.length > 0) {
          return 0 - value;
        }
        return value;
      },
    });

    expect(result).to.deep.eq([-1, -2, -3]);
  });

  it('should replace object children before walk', () => {
    const data = { a: 1, b: 2, c: 3 };

    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        if (pointer.length > 0) {
          return 0 - value;
        }
        return value;
      },
    });

    expect(result).to.deep.eq({ a: -1, b: -2, c: -3 });
  });

  it('should replace object children after walk', () => {
    const data = { a: 1, b: 2, c: 3 };

    const result = walkAndReplace(data, {
      afterWalk: (value: any, pointer: string[]) => {
        if (pointer.length > 0) {
          return 0 - value;
        }
        return value;
      },
    });

    expect(result).to.deep.eq({ a: -1, b: -2, c: -3 });
  });

  it('should visit and replace children of values returned from before walk', () => {
    const data = { a: 1, b: 2, c: 3 };

    const before = [];
    const after = [];
    const result = walkAndReplace(data, {
      beforeWalk: (value: any, pointer: string[]) => {
        before.push(pointer.join('/'));
        if (pointer.join('/') === 'a') {
          return ['a', 'b', 'c'];
        }
        if (value == 'a') {
          return 'x';
        }
        return value;
      },
      afterWalk: (value: any, pointer: string[]) => {
        after.push(pointer.join('/'));
        return value;
      },
    });

    expect(result).to.deep.eq({
      a: ['x', 'b', 'c'],
      b: 2,
      c: 3,
    });
    expect(before).to.deep.eq(['', 'a', 'a/0', 'a/1', 'a/2', 'b', 'c']);
    expect(after).to.deep.eq(['a/0', 'a/1', 'a/2', 'a', 'b', 'c', '']);
  });
});
