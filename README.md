<p align="center">
  <h3 align="center">jestdouble <small style="color:red">(not published yet)</small></h3>
  <p align="center">jestdouble is an alternative mock/spy for jasmine/jest.<p>
  <p align="center">
    <!--a href="https://www.npmjs.com/package/jestdouble">
      <img src="https://img.shields.io/npm/v/jestdouble.svg" alt="npm version">
    </a-->
    <a href="https://travis-ci.org/Moeriki/jestdouble">
      <img src="https://travis-ci.org/Moeriki/jestdouble.svg?branch=master" alt="Build Status"></img>
    </a>
    <a href="https://coveralls.io/github/Moeriki/jestdouble?branch=master">
      <img src="https://coveralls.io/repos/github/Moeriki/jestdouble/badge.svg?branch=master" alt="Coverage Status"></img>
    </a>
    <!--a href="https://david-dm.org/moeriki/jestdouble">
      <img src="https://david-dm.org/moeriki/jestdouble/status.svg" alt="dependencies Status"></img>
    </a-->
    <!--a href="https://snyk.io/test/github/moeriki/jestdouble">
      <img src="https://snyk.io/test/github/moeriki/jestdouble/badge.svg" alt="Known Vulnerabilities"></img>
    </a-->
  </p>
</p>

*   [Installation](#installation)
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

I wanted a mocking function that:

*   could [conditionally verify calls](#conditionally-verifying-calls)
*   had [smart value matching](#matching) enabled by default
*   had an awesome API
*   was [compatible with jasmine assertions](#verifying-calls)

<a name="quick-start" />
## Quick start

```javascript
const jd = require('jestdouble');

const func = jd(); // create a jest double

func.returns(1, { times: 1 });
func.returns(2);

func(); // 1
func(); // 2

expect(func).toHaveBeenCalledTimes(2);
```

<a name="mocking-results"></a>
## Mocking results

### Invoking a function

```javascript
function sum(num1, num2) {
    return num1 + num1;
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
func.callbacks(new Error('nope')); // aliased as 'callsback' if that makes more sense to you
func((err) => {/* Error<nope> */});
```

**calling back value**

```javascript
const func = jd();
func.callbacks(null, 1); // aliased as 'callsback' if that makes more sense to you
func((err, value) => {/* null, 1 */});
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

Both mocking results and verifying calls support [smart value matching](https://github.com/Moeriki/node-matchr). Check the [API of matchr](https://github.com/Moeriki/node-matchr).

```javascript
const func = jd();
func.calledWith((str) => str === 'one').returns(1);
func.calledWith(String).returns(2);
func('one');
func('two');
func('three');
expect(func.with(/^t.*/)).toHaveBeenCalledTimes(2);
```

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

func.calledWith([{ a: 1 }, [1, 2, 3]]).returns('ok');

func([{ a: 1, b: 2 }, [3, 2]]); // 'ok'
```

```javascript
const func = td();
func([3, 2, 1]);
expect(func.with([3, 2])).toHaveBeenCalled();
```

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

The name is based on [jest](https://github.com/facebook/jest) and [testdouble.js](https://github.com/testdouble/testdouble.js). API design is inspired by [testdouble.js](https://github.com/testdouble/testdouble.js).
