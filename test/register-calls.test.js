'use strict';

// modules

const jd = require('../index'); // eslint-disable-line id-length

const utils = require('./utils');

// tests

describe('register-calls', () => {

  let func;

  beforeEach(() => {
    func = jd();
  });

  describe('calledWith', () => {

    it('should return value when called exactly', () => {
      func.calledWith('one').returns(1);
      expect(func('one')).toBe(1);
    });

    it('should return value when called exactly with callback implicitely', (done) => {
      func.calledWith('one').callbacks(null, 1);
      func('one', (err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        done();
      });
    });

    it('should return value when called exactly with callback explicitely', (done) => {
      func.calledWith('one', Function).callbacks(null, 1);
      func('one', (err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        done();
      });
    });

    it('should not return value when called with more arguments', () => {
      func.calledWith('one').returns(1);
      expect(func('one', 'two')).toBe(undefined);
    });

    it('should not return value when called with less arguments', () => {
      func.calledWith('one').returns(1);
      expect(func()).toBe(undefined);
    });

    it('should not return value when called with other arguments', () => {
      func.calledWith('one').returns(1);
      expect(func('two')).toBe(undefined);
    });

    it('should throw when calledWith without response', () => {
      func.calledWith('one');
      expect(() => func.calledWith()).toThrowError(
        'Expected previous calledWith to have had a response.'
      );
    });

  });

  describe('calledStartingWith', () => {

    it('calledStartingWith should return value when called exactly', () => {
      func.calledStartingWith('one').returns(1);
      expect(func('one')).toBe(1);
    });

    it('calledStartingWith should return value when called exactly with callback implicitely', (done) => {
      func.calledStartingWith('one').callbacks(null, 1);
      func('one', (err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        done();
      });
    });

    it('calledStartingWith should return value when called exactly with callback explicitely', (done) => {
      func.calledStartingWith('one', Function).callbacks(null, 1);
      func('one', (err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        done();
      });
    });

    it('calledStartingWith should return value when called with more arguments', () => {
      func.calledStartingWith('one').returns(1);
      expect(func('one', 'two')).toBe(1);
    });

    it('calledStartingWith should return value when called with more arguments and callback', (done) => {
      func.calledStartingWith('one').callbacks(null, 1);
      func('one', 'two', (err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        done();
      });
    });

    it('calledStartingWith should not return value when called with less arguments', () => {
      func.calledStartingWith('one').returns(1);
      expect(func()).toBe(undefined);
    });

    it('calledStartingWith should not return value when called with less arguments and callback', (done) => {
      func.calledStartingWith('one').callbacks(null, 1);
      func(utils.dontc);
      setImmediate(done);
    });

    it('calledStartingWith should not return value when called with other arguments', () => {
      func.calledStartingWith('one').returns(1);
      expect(func('two')).toBe(undefined);
    });

    it('should throw when calledStartingWith without response', () => {
      func.calledStartingWith('one');
      expect(() => func.calledStartingWith()).toThrowError(
        'Expected previous calledStartingWith to have had a response.'
      );
    });

  });

});
