'use strict';

// modules

const times = require('lodash/times');
const timesAsync = require('async/times');

// constants

const N_TIMES = 3;

const MANY_TIMES = 10;

// exports

const dontCallMe = () => {
  throw new Error('Expected function not to be called.');
};

const nTimes = (func) => times(N_TIMES, func);

const nTimesAsync = (func, callback) => {
  timesAsync(N_TIMES, (_, done) => {
    func(done);
  }, callback);
};

const manyTimes = (func) => times(MANY_TIMES, func);

const manyTimesAsync = (func, callback) => {
  timesAsync(MANY_TIMES, (_, done) => {
    func(done);
  }, callback);
};

module.exports = {
  dontCallMe,
  N_TIMES,
  nTimes,
  nTimesAsync,
  manyTimes,
  manyTimesAsync,
};
