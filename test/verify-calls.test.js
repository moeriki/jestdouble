'use strict';

// modules

const jd = require('../index'); // eslint-disable-line id-length

// tests

describe('verify', () => {

  let func;

  beforeEach(() => {
    func = jd();
  });

  it('should be jest compatible', () => {
    func('one');
    func('two');
    expect(func).toHaveBeenCalled();
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenCalledWith('one');
  });

  describe('with', () => {

    beforeEach(() => {
      func = jd();
      func('one');
      func('two');
      func('three');
    });

    it('should verify when called exactly', () => {
      expect(func.with('one')).toHaveBeenCalled();
    });

    it('should verify when called exactly with callback');

    it('should not verify when called with more arguments', () => {
      expect(func.with('one', 'two')).not.toHaveBeenCalled();
    });

    it('should not verify when called with more arguments and callback');

    it('should not verify when called with less arguments', () => {
      expect(func.with()).not.toHaveBeenCalled();
    });

    it('should not verify when called with less arguments and callback');

    it('should not verify when called with other arguments', () => {
      expect(func.with('four')).not.toHaveBeenCalled();
    });

    it('should verify with match', () => {
      expect(func.with((arg) => arg === 'one')).toHaveBeenCalled();
      expect(func.with(/^t.*/)).toHaveBeenCalledTimes(2);
    });

  });

  describe('startingWith', () => {

    beforeEach(() => {
      func = jd();
      func('one', 'two');
      func('two', 'three');
    });

    it('startingWith should verify when called exactly', () => {
      expect(func.startingWith('one')).toHaveBeenCalled();
    });

    it('startingWith should verify when called with more arguments', () => {
      expect(func.startingWith('one')).toHaveBeenCalled();
    });

    it('startingWith should not verify when called with less arguments', () => {
      expect(func.startingWith('one', 'two', 'three')).not.toHaveBeenCalled();
    });

    it('startingWith should not verify when called with other arguments', () => {
      func('two');
      expect(func.startingWith('three')).not.toHaveBeenCalled();
    });

  });

});
