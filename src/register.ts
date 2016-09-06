import transform from './index';

var fs = require('fs');

var prev = require.extensions['.js'];

require.extensions['.js'] = function(module: any, filename: string) {
  if (filename.indexOf('node_modules') === -1) {
    var source = fs.readFileSync(filename, 'utf8');
    module._compile(transform(source), filename);
  } else if (prev) {
    prev(module, filename);
  } else {
    var source = fs.readFileSync(filename, 'utf8');
    module._compile(source, filename);
  }
};