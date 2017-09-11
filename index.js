'use strict';

// modules

const matchr = require('matchr');

// private variables

const DEFAULT_RESPONSE = {
  allowAdditionalArgs: false,
  args: [],                   // Array<*>
  error: null,                // null / Error
  invokee: null,              // null / Function - mock invokee
  times: Infinity,            // null / number
  type: 'return',             // enum /callback|invokee|promise|return/
  value: undefined,           // *
};

const THIS = Symbol('this');

// utils

const last = (array) => array.length !== 0 ? array[array.length - 1] : undefined;

// private functions

function assignAllWithDefaultResponse() {
  return Array.from(arguments).reduce(
    (allConfigs, config) => Object.assign(allConfigs, config),
    Object.assign({}, DEFAULT_RESPONSE)
  );
}

const createJasmineFakeMock = (calls) => ({
  _isMockFunction: true,
  mock: { calls },
});

const toString = (response) => { // eslint-disable-line
  switch (response.type) { // eslint-disable-line default-case
    case 'callback':
      return `${response.type} ${response.error ? 'Error' : 'value'}`;
    case 'return':
      return response.error ? 'thrown Error' : 'return value';
    case 'invokee':
      return 'mock implementation';
    case 'promise':
      return `${response.error ? 'rejected' : 'resolved'} ${response.type}`;
  }
};

// initialise

matchr.setDefaultOptions({
  matchPartialObjects: false,
  matchPartialArrays: false,
  matchOutOfOrderArrays: false,
});

// exports

function jestdouble(invokee) {

  // private variables

  const calls = [/* args: Array<*> */];

  let callExpectingResponse = null;

  const responses = []; // see DEFAULT_CONFIG

  const fallbackResponses = []; // see DEFAULT_CONFIG, but never has args

  // private functions

  function registerCall(expectedArgs, config) {
    if (callExpectingResponse) {
      throw new Error(`Expected previous called${callExpectingResponse.allowAdditionalArgs ? 'Starting' : ''}With to have had a response.`);
    }
    callExpectingResponse = assignAllWithDefaultResponse(
      { args: expectedArgs },
      config
    );
    if (expectedArgs.length === 0) {
      fallbackResponses.push(callExpectingResponse);
    } else {
      responses.push(callExpectingResponse);
    }
  }

  function registerResponse(config) {
    const lastFallbackResponse = last(fallbackResponses);
    if (callExpectingResponse) {
      Object.assign(callExpectingResponse, config);
      callExpectingResponse = false;
    } else if (lastFallbackResponse && lastFallbackResponse.times === Infinity) {
      throw new Error(`Registering a ${toString(config)} that can never be called.`);
    } else {
      fallbackResponses.push(
        assignAllWithDefaultResponse({ allowAdditionalArgs: true }, config)
      );
    }
  }

  // initialise

  if (invokee) {
    fallbackResponses.push(
      assignAllWithDefaultResponse({
        allowAdditionalArgs: true,
        invokee: typeof invokee === 'function'
          ? invokee
          : () => invokee,
        type: 'invokee',
      })
    );
  }

  // exposed

  function double() { // eslint-disable-line
    const callArgs = Array.from(arguments);
    calls.push(callArgs);

    const isMatching = (response) => {
      if (response.times === 0) {
        return false;
      }
      let responseArgsLength = response.args.length;
      if (response.type === 'callback' && last(response.args) !== Function) {
        responseArgsLength++;
      }
      if (callArgs.length > responseArgsLength && !response.allowAdditionalArgs) {
        return false;
      }
      return response.args.every(
        (responseArg, index) => matchr(callArgs[index], responseArg)
      );
    };

    const response = responses.find(isMatching) || fallbackResponses.find(isMatching);

    if (!response) {
      return undefined;
    }

    response.times--;
    last(calls).response = response;

    switch (response.type) { // eslint-disable-line default-case
      case 'callback':
        const callback = last(callArgs);
        if (response.error) {
          return callback(response.error);
        }
        return callback(null, response.value);
      case 'invokee':
        return response.invokee.apply(this, callArgs); // eslint-disable-line no-invalid-this
      case 'promise':
        if (response.error) {
          return Promise.reject(response.error);
        }
        return Promise.resolve(response.value);
      case 'return':
        if (response.error) {
          throw response.error;
        }
        return response.value === THIS
          ? this // eslint-disable-line no-invalid-this
          : response.value
        ;
    }
  }

  Object.assign(double, createJasmineFakeMock(calls), {
    // register calls
    calledStartingWith() {
      const expectedArgs = Array.from(arguments);
      registerCall(expectedArgs, { allowAdditionalArgs: true });
      return double;
    },
    calledWith() {
      const expectedArgs = Array.from(arguments);
      registerCall(expectedArgs);
      return double;
    },
    // register responses
    callbacks(error, value, options) {
      registerResponse(Object.assign({ error, type: 'callback', value }, options));
      return double;
    },
    callsback(error, value, options) {
      registerResponse(Object.assign({ error, type: 'callback', value }, options));
      return double;
    },
    invokes(func, options) {
      if (typeof func !== 'function') {
        throw new TypeError(`Expected invokee to be of type 'function'. Instead it is of type '${typeof func}'`);
      }
      registerResponse(Object.assign({ invokee: func, type: 'invokee' }, options));
      return double;
    },
    returns(value, options) {
      registerResponse(Object.assign({ type: 'return', value }, options));
      return double;
    },
    returnsThis(options) {
      registerResponse(Object.assign({ type: 'return', value: THIS }, options));
      return double;
    },
    resolves(value, options) {
      registerResponse(Object.assign({ type: 'promise', value }, options));
      return double;
    },
    rejects(error, options) {
      registerResponse(Object.assign({ error, type: 'promise' }, options));
      return double;
    },
    throws(error, options) {
      registerResponse(Object.assign({ error, type: 'return' }, options));
      return double;
    },
    // verify calls
    startingWith() {
      const verifyArgs = Array.from(arguments);
      return createJasmineFakeMock(
        calls.filter((call) =>
          verifyArgs.every((verifyArg, index) =>
            matchr(call[index], verifyArg)
          ))
      );
    },
    with() {
      const verifyArgs = Array.from(arguments);
      return createJasmineFakeMock(
        calls.filter((call) => {
          if (verifyArgs.length < call.length) {
            return false;
          }
          return verifyArgs.every((verifyArg, index) =>
            matchr(call[index], verifyArg)
          );
        })
      );
    },
  });

  return double;
}

jestdouble.fn = jestdouble; // eslint-disable-line id-length
jestdouble.func = jestdouble;

jestdouble.setMatchingOptions = matchr.setDefaultOptions;

module.exports = jestdouble;
