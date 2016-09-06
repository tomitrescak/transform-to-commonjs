module.exports = function(wallaby) {
  // var load = require;

  return {
    files: [
      "src/*.ts"
    ],
    tests: [
      "src/tests/*.ts"
    ],
    compilers: {
      "**/*.ts*": wallaby.compilers.typeScript({module: "commonjs", target: "es5"})
    },
    env: {
      type: "node"
    },
    testFramework: "mocha",
  };
};
