require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' });

const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const dirtyChai = require('dirty-chai');

chai.use(sinonChai);
chai.use(dirtyChai);

global.expect = chai.expect;
global.sinon = sinon;
