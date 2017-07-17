<p align="center">
  <h3 align="center">jestdouble</h3>
  <p align="center">jestdouble is an alternative mock/spy for jest.<p>
  <p align="center">
    <a href="https://www.npmjs.com/package/jestdouble">
      <img src="https://img.shields.io/npm/v/jestdouble.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/Moeriki/jestdouble">
      <img src="https://travis-ci.org/Moeriki/jestdouble.svg?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/jestdouble?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/jestdouble/badge.svg?branch=master" alt="Coverage Status"></img>
    </a>
    <a href="https://snyk.io/test/github/moeriki/jestdouble">
      <img src="https://snyk.io/test/github/moeriki/jestdouble/badge.svg" alt="Known Vulnerabilities"></img>
    </a>
  </p>
</p>

*   [Installation](#installation)
*   [Why](#why)
*   [Quick start](#quick-start)
*   [Mocking results](#mocking-results)
*   [Conditionally mocking results](#conditionally-mocking-results)
*   [Verifying calls](#verifying-calls)
*   [Conditionally verifying calls](#conditionally-verifying-calls)
*   [Matching](#matching)
*   [Notes](#notes)
*   [Credit](#credit)

<a name="installation"></a>
## Installation

```
$ npm install --save-dev jestdouble
```

<a name="why"></a>
## Why

I wanted a mock/spy function that:

*   could conditionally [mock results](#conditionally-mocking-results) / [verify calls](#conditionally-verifying-calls)
*   had [smart value matching](#matching) enabled by default
*   was [compatible with jasmine assertions](#verifying-calls)
*   had an awesome API

<a name="quick-start"></a>
## Quick start

```javascript
const jd = require('jestdouble');

const func = jd(); // create a jest double

func.returns(1, { times: 1 });
func.returns(2);

func(); // 1
func(); // 2
func(); // 2

expect(func).toHaveBeenCalledTimes(3);
```

<a name="mocking-results"></a>
## Mocking results

### Invoking a function

```javascript
function sum(num1, num2) {
    return num1 + num2;
}
const mockedSum = jd(sum);
mockedSum(1, 2); // 3
```

```javascript
const func = jd();
func.invokes(() => 1));
func(); // 1
```

### Returning values

**returning value**

```javascript
const func = jd();
func.returns(1);
func(); // 1
```

**returning this**

```javascript
const object = {
  func: td()
};
object.func.returnsThis();
object.func(); // object
```

**returning rejected error**

```javascript
const func = jd();
func.rejects(new Error('nope'));
func().catch((err) => {/* Error<nope> */});
```

**returning resolved value**

```javascript
const func = jd();
func.resolves(1);
func().then((value) => {/* 1 */});
```

**throwing value**

```javascript
const func = jd();
func.throws(new Error('nope'));
func(); // throws Error<nope>
```

**calling back error**

```javascript
const func = jd();
func.callbacks(new Error('nope'));
func((err) => {/* Error<nope> */});
```

**calling back value**

```javascript
const func = jd();
func.callbacks(null, 1);
func((err, value) => {/* null, 1 */});
```

### Mocking options

**times**

```javascript
const func = jd();
func.calledWith('one').returns(1, { times: 1 });
func.returns(2, { times: 1 });
func.returns(3);

func('one'); // 1
func(); // 2
func('one'); // 3
func(); // 3
```

<a name="conditionally-mocking-results"></a>
## Conditionally mocking results

**calledWith**

```javascript
const func = jd();
func.calledWith('one').returns(1);
func(); // undefined
func('one'); // 1
func('one', 'two'); // undefined
```

**calledStartingWith**

```javascript
const func = jd();
func.calledStartingWith('one').returns(1);
func(); // undefined
func('one'); // 1
func('one', 'two'); // 1
```

<a name="verifying-calls"></a>
## Verifying calls

`jestdouble` is compatible with jasmine assertions.

```javascript
const func = jd();
func('one');
func('two');
func('three');
expect(func).toHaveBeenCalled();
expect(func).toHaveBeenCalledTimes(3);
expect(func).toHaveBeenCalledWith('one');
```

<a name="conditionally-verifying-calls"></a>
## Conditionally verifying calls

**with**

```javascript
const func = jd();
func('one', 'two');
expect(func.with('one')).not.toHaveBeenCalled();
expect(func.with('one', 'two')).toHaveBeenCalled();
```

**startingWith**

```javascript
const func = jd();
func('one', 'two');
expect(func.startingWith('one')).toHaveBeenCalled();
expect(func.startingWith('one', 'two')).toHaveBeenCalled();
```

<a name="matching"></a>
## Matching

Both mocking results and verifying calls support smart value matching.

```javascript
const func = jd();
func.calledWith((str) => str === 'one').returns(1);
func.calledWith(Number).returns(2);
func('one'); // 1
func(2); // 2
```

```javascript
const func = jd();
func('two');
func('three');
expect(func.with(/^t/)).toHaveBeenCalledTimes(2);
```

Check the [API of matchr](https://github.com/Moeriki/node-matchr) to learn all the possibilities.

### Matching options

There are three matching options.

```javascript
const td = require('testdouble');

td.setMatchingOptions({
  matchPartialObjects: true,   // default: false
  matchPartialArrays: true,    // default: false
  matchOutOfOrderArrays: true, // default: false
});

const func = td();

func.calledWith([{ c: 3 }, { a: 1 }]).returns('OK');

func([{ a: 1, z: 26 }, { b: 2 }, { c: 3 }]); // 'OK'
```

`setMatchingOptions` delegates to `matchr.setDefaultOptions`.

## API

**Mock**

`jestdouble.invokes( arg:function [, options:object] )`

`jestdouble.returns( arg:* [, options:object] )`

`jestdouble.returnsThis( [options:object] )`

`jestdouble.resolves( arg:* [, options:object] )`

`jestdouble.rejects( arg:* [, options:object] )`

`jestdouble.callsback( arg:* [, options:object] ) // aliased as callbacks`

`jestdouble.throws( arg:* [, options:object] )`

**Conditional mock**

`jestdouble.calledWith( ...args:* ).invokes( arg:function [, options:object] )`

`jestdouble.calledWith( ...args:* ).returns( arg:* [, options:object] )`

`jestdouble.calledWith( ...args:* ).returnsThis( [options:object] )`

`jestdouble.calledWith( ...args:* ).resolves( arg:* [, options:object] )`

`jestdouble.calledWith( ...args:* ).rejects( arg:* [, options:object] )`

`jestdouble.calledWith( ...args:* ).callsback( arg:* [, options:object] ) // aliased as callbacks`

`jestdouble.calledWith( ...args:* ).throws( arg:* [, options:object] )`

`jestdouble.calledStartingWith( ...args:* ).invokes( arg:function [, options:object] )`

`jestdouble.calledStartingWith( ...args:* ) .returns( arg:* [, options:object] )`

`jestdouble.calledStartingWith( ...args:* ) .returnsThis( [options:object] )`

`jestdouble.calledStartingWith( ...args:* ) .resolves( arg:* [, options:object] )`

`jestdouble.calledStartingWith( ...args:* ) .rejects( arg:* [, options:object] )`

`jestdouble.calledStartingWith( ...args:* ) .callsback( arg:* [, options:object] )  // aliased as callbacks`

`jestdouble.calledStartingWith( ...args:* ) .throws( arg:* [, options:object] )`

**Mock options**

*   **times** mock result _N_ times

**Verify**

`expect( jestdouble ).toHaveBeenCalled();`

`expect( jestdouble.with( ...args:* ) ).toHaveBeenCalled();`

`expect( jestdouble.startingWith( ...args:* ) ).toHaveBeenCalled();`

## Notes

**Results order**

Conditionally mocked results will always be returned in favour of mocked results without conditional arguments.

```javascript
const func = td();
func.returns(Infinity);
func.calledWith('one').returns(1);
func(); // Infinity
func('one'); // 1
```

```javascript
const func = td(() => 1);
func.calledWith('two').returns(2);
func(); // 1
func('two'); // 2
```

## Credit

The name is inspired by [jest](https://github.com/facebook/jest) and [testdouble.js](https://github.com/testdouble/testdouble.js). API design is inspired by [testdouble.js](https://github.com/testdouble/testdouble.js).
