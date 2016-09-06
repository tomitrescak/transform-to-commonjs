import * as assert from 'assert';
import transform from '../index';

describe('transform', () => {
  it('transforms named imports', () => {
    const imp = "import 'Bar'";
    assert.equal(transform(imp), "require('Bar')");

    const imp1 = "import * as Foo from 'Bar'";
    assert.equal(transform(imp1), "const Foo = require('Bar')");
  });

  it('transforms default imports', () => {
    const imp = "import Foo from 'Bar'";
    assert.equal(transform(imp), "const Foo = require('Bar').default");

    const imp1 = "import * as Foo from 'Bar'";
    assert.equal(transform(imp1), "const Foo = require('Bar')");
  });

  it('transforms named arguments', () => {
    const imp = "import { Foo, Foo1 } from 'Bar'";
    assert.equal(transform(imp), "const { Foo, Foo1 } = require('Bar')");

    const imp1 = "import { Foo as Boo, Foo1 } from 'Bar'";
    assert.equal(transform(imp1), "const { Foo: Boo, Foo1 } = require('Bar')");
  });

  it('transforms default and named arguments', () => {
    const imp = "import Foo, { Foo1 } from 'Bar'";
    assert.equal(transform(imp), "const Foo = require('Bar').default\nconst { Foo1 } = require('Bar')");

    const imp1 = "import * as Foo { Foo1 } from 'Bar'";
    assert.equal(transform(imp1), "const Foo = require('Bar')\nconst { Foo1 } = require('Bar')");
  });

  it('transforms exports', () => {
    let imp = "export function m()";
    assert.equal(transform(imp), "function m()\nexports.m = m;");
  });

  it('transforms multiple exports', () => {
    let imp = `export function m()\nexport const n()`;
    assert.equal(transform(imp), "function m()\nconst n()\nexports.m = m;\nexports.n = n;");
  });

  it('transforms default exports', () => {
    let imp = `export default function m()\nexport const n()`;
    assert.equal(transform(imp), "function m()\nconst n()\nexports.n = n;\nexports.default = m;");
  });

  it('transforms unnamed default exports', () => {
    let imp = `export default function ()`;
    assert.equal(transform(imp), "function defaultFunction()\nexports.default = defaultFunction;");

    imp = `export default {`;
    assert.equal(transform(imp), "const defaultObject = {\nexports.default = defaultObject;");

    imp = `export default () =>`;
    assert.equal(transform(imp), "const defaultFunction = () =>\nexports.default = defaultFunction;");
  });

  it('transforms default export variables', () => {
    let imp = `export default m`;
    assert.equal(transform(imp), "m\nexports.default = m;");
  });
});
