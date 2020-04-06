import 'idempotent-babel-polyfill';
import Generator from 'yeoman-generator';
import configuring from './configuring';
import conflicts from './conflicts';
import end from './end';
import initializing from './initializing';
import install from './install';
import prompting from './prompting';
import runDefault from './default';
import writing from './writing';

module.exports = class extends Generator {
  async initializing() {
    return initializing(this);
  }

  async prompting() {
    return prompting(this);
  }

  async configuring() {
    return configuring(this);
  }

  async default() {
    return runDefault(this);
  }

  async writing() {
    return writing(this);
  }

  async conflicts() {
    return conflicts(this);
  }

  async install() {
    return install(this);
  }

  async end() {
    return end(this);
  }
};
