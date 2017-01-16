'use strict';

// modules

const jd = require('../index'); // eslint-disable-line id-length

// tests

describe('jestdouble', () => {

  let func;

  it('should be jest mock function', () => {
    func = jd();
    expect(jest.isMockFunction(func)).toBe(true);
  });

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

  it('should expose matchr options', () => {
    expect(jd.setMatchingOptions).toBeInstanceOf(Function);
  });

});
