#!/usr/bin/env node
const { md5 } = require('js-md5');

const text = process.argv[2];

console.log('md5:', md5(text));
process.exit(1);