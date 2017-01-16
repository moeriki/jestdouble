'use strict';

// modules

const jd = require('../index'); // eslint-disable-line id-length

const utils = require('./utils');

const dontCallMe = utils.dontCallMe;
const N_TIMES = utils.N_TIMES;
const nTimes = utils.nTimes;
const nTimesAsync = utils.nTimesAsync;
const manyTimes = utils.manyTimes;
const manyTimesAsync = utils.manyTimesAsync;

// tests

describe('register-responses', () => {

  let func;

  beforeEach(() => {
    func = jd();
  });

  it('should return value', () => {
    func.returns(1);
    manyTimes(() => expect(func()).toBe(1));
  });

  it('should return value N times', () => {
    func.returns(1, { times: N_TIMES });
    nTimes(() => expect(func()).toBe(1));
    expect(func()).toBe(undefined);
  });

  it('should return value X N times, X M times', () => {
    func.returns(1, { times: N_TIMES });
    func.returns(2, { times: N_TIMES });
    nTimes(() => expect(func()).toBe(1));
    nTimes(() => expect(func()).toBe(2));
    expect(func()).toBe(undefined);
  });

  it('should return this', () => {
    func.returnsThis();
    const pojo = { func };
    manyTimes(() => expect(pojo.func()).toBe(pojo));
  });

  it('should return this N times', () => {
    func.returnsThis({ times: N_TIMES });
    const pojo = { func };
    nTimes(() => expect(pojo.func()).toBe(pojo));
  });

  it('should throw Error', () => {
    func.throws(new Error('NOPE'));
    manyTimes(() => expect(func).toThrowError('NOPE'));
  });

  it('should throw Error N times', () => {
    func.throws(new Error('NOPE'));
    nTimes(() => expect(func).toThrowError('NOPE'));
  });

  it('should invoke invokee', () => {
    func.invokes(() => 1);
    manyTimes(() => expect(func()).toBe(1));
  });

  it('should invoke invokee with args', () => {
    func.invokes((one, two) => [one, two]);
    manyTimes(() => expect(func(1, 2)).toEqual([1, 2]));
  });

  it('should throw when invokee is not a function', () => {
    manyTimes(() => expect(() => func.invokes('not a function')).toThrowError(
      'Expected invokee to be of type \'function\'. Instead it is of type \'string\''
    ));
  });

  it('should "callbacks" Error', (done) => {
    func.callbacks(new Error('NOPE'));
    manyTimesAsync((cb) => {
      func((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('NOPE');
        cb();
      });
    }, done);
  });

  it('should "callsback" Error', (done) => {
    func.callsback(new Error('NOPE'));
    manyTimesAsync((cb) => {
      func((err) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('NOPE');
        cb();
      });
    }, done);
  });

  it('should "callbacks" value', (done) => {
    func.callbacks(null, 1);
    manyTimesAsync((cb) => {
      func((err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        cb();
      });
    }, done);
  });

  it('should "callbacks" value N times', (done) => {
    func.callbacks(null, 1, { times: N_TIMES });
    nTimesAsync((cb) => {
      func((err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        cb();
      });
    }, done);
  });

  it('should "callsback" value', (done) => {
    func.callsback(null, 1);
    manyTimesAsync((cb) => {
      func((err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        cb();
      });
    }, done);
  });

  it('should "callsback" value N times', (done) => {
    func.callsback(null, 1, { times: N_TIMES });
    nTimesAsync((cb) => {
      func((err, value) => {
        expect(err).toBe(null);
        expect(value).toBe(1);
        cb();
      });
    }, done);
  });

  it('should reject Error', () => {
    func.rejects(new Error('NOPE'));
    return Promise.all([
      manyTimes(() => func()
        .then(dontCallMe)
        .catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe('NOPE');
        })),
    ]);
  });

  it('should resolve value', () => {
    func.resolves(1);
    return Promise.all([
      manyTimes(() => func()
        .catch(dontCallMe)
        .then((value) => {
          expect(value).toBe(1);
        })),
    ]);
  });

  it('should resolve value N times', () => {
    func.resolves(1);
    return Promise.all(
      nTimes(() => func()
        .catch(dontCallMe)
        .then((value) => {
          expect(value).toBe(1);
        }))
    );
  });

  it('should throw when mock has a fallback return value', () => {
    func = jd(() => 1);
    expect(() => func.returns(2)).toThrowError('Registering a return value that can never be called.');
  });

  it('should throw when mock already has a call-less infinite return value', () => {
    func.returns(1);
    expect(() => func.returns(2)).toThrowError('Registering a return value that can never be called.');
  });

  it('should throw when mock already has a calledWith infinite return value', () => {
    func.calledWith().returns(1);
    expect(() => func.returns(2)).toThrowError('Registering a return value that can never be called.');
  });

  it('should throw when mock has a fallback thrown Error', () => {
    func.returns(1);
    expect(() => func.throws(new Error('NOPE'))).toThrowError('Registering a thrown Error that can never be called.');
  });

  it('should throw when mock has a fallback callback Error', () => {
    func.returns(1);
    expect(() => func.callsback(new Error('NOPE'))).toThrowError('Registering a callback Error that can never be called.');
  });

  it('should throw when mock has a fallback callback value', () => {
    func.returns(1);
    expect(() => func.callsback(null, 2)).toThrowError('Registering a callback value that can never be called.');
  });

  it('should throw when mock has a fallback invokee', () => {
    func.returns(1);
    expect(() => func.invokes(() => 2)).toThrowError('Registering a mock implementation that can never be called.');
  });

  it('should throw when mock has a fallback resolved promise', () => {
    func.returns(1);
    expect(() => func.resolves(2)).toThrowError('Registering a resolved promise that can never be called.');
  });

  it('should throw when mock has a fallback rejected promise', () => {
    func.returns(1);
    expect(() => func.rejects(new Error('NOPE'))).toThrowError('Registering a rejected promise that can never be called.');
  });

});
