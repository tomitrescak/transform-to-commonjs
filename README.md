# Introduction

Node 6 supports almost whole ES 6 specification but there is not support for ES6 imports :/

This plugin transforms your ES6 *imports / exports to commonjs* counterparts.
**NO BABEL, No sourcemapping is needed**.

**The output is in ES6**.

As a result, you can use it with Node 6 for server implementations.

EXAMPLE:

```js
import Foo, { Foo1 } from 'Bar';

export function m() {}
export const n();
export default function () {}

// to

const Foo = require('Bar').default;
const { Foo1 } = require('Bar');

function m() {}
const n;
function defaultFunction() {}

exports.m = m;
exports.n = n;
exports.default = defaultFunction;
```

# How to use

Simply import the registration script as a first line in your server:

```js
require('import-to-commonjs/dist/register');
```

# Known issues

Currently none, but I'm pretty sure I missed some import cases. PRs welcome.

