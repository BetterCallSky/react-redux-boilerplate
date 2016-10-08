// ---------------------------------------
// Test Environment Setup
// ---------------------------------------
import 'babel-polyfill';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import chaiEnzyme from 'chai-enzyme';

require('babel-runtime/core-js/promise').default = require('bluebird');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();

// ---------------------------------------
// Require Tests
// ---------------------------------------
// for use with karma-webpack-with-fast-source-maps
const __karmaWebpackManifest__ = []; // eslint-disable-line
const inManifest = (path) => ~__karmaWebpackManifest__.indexOf(path);

// require all `tests/**/*.spec.js`
const testsContext = require.context('../src', true, /\.spec\.js$/);

// only run tests that have changed after the first pass.
const testsToRun = testsContext.keys().filter(inManifest);
(testsToRun.length ? testsToRun : testsContext.keys()).forEach(testsContext);

// require all `src/**/*.js` except for `main.js` (for isparta coverage reporting)
console.log('COVERAGE', __COVERAGE__);
if (__COVERAGE__) {
  const componentsContext = require.context('../src/', true, /^((?!main|spec).)*\.jsx?$/);
  console.log(componentsContext);
  console.log(componentsContext.keys());
  componentsContext.keys().forEach((item) => {
    console.log(item);
    componentsContext(item);
  });
}
