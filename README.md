# Introduction

Tired of waiting for ES6 `imports` implementation in Node.JS?
Tired of using transpilers with difficult defug and sourcemapping?

This plugin transforms your ES6 imports to commonjs counterparts.
No sourcemapping is needed.

# How to use

Simply import the registration script as a first line in your server:

```js
require('import-to-commonjs/dist/register');
```

# Known issues

Currently none, but I'm pretty sure I missed some import cases. PRs welcome.

