#!/usr/bin/env node
const fs = require('fs');
const { publicKeyPath, privateKeyPath } = require('../server/certs/index.cjs');
const { generateRsaKeyPair, writeKeyToFile } = require('../server/utils/crypto.cjs');

const command = process.argv[2];

switch (command) {
  case 'generate':
    createOrUpdateKeyFile();
    break;
  case 'remove':
    deleteKeyFile();
    break;
  default:
    console.log('❌ Unknown command. Usage:');
    console.log('   node rsa.cjs generate    - Generate Rsa key pair file');
    console.log('   node rsa.cjs remove  - Delete Rsa key pair file');
    process.exit(1);
}

function createOrUpdateKeyFile() {
  const { publicKey, privateKey } = generateRsaKeyPair();
  console.log('🔑 Generating Rsa key pair...');

  writeKeyToFile(publicKey, publicKeyPath);
  writeKeyToFile(privateKey, privateKeyPath);
}

function deleteKeyFile() {
  console.log('Deleting Rsa key pair...');
  fs.unlinkSync(publicKeyPath);
  fs.unlinkSync(privateKeyPath);
  console.log('✅ Rsa key pair deleted.');
}