'use strict';

// modules

const jd = require('../index'); // eslint-disable-line id-length

// tests

describe('jestdouble', () => {

  let func;

  it('should create double with implementation', () => {
    func = jd(() => 1);
    expect(func()).toBe(1);
  });

  it('should create double with returning static value', () => {
    func = jd(1);
    expect(func()).toBe(1);
  });

  it('should call implementation with args', () => {
    func = jd((one, two, three) => [one, two, three]);
    expect(func(1, 2, 3)).toEqual([1, 2, 3]);
  });

});
