const fs = require('fs');
const { generateKeyPairSync } = require('crypto');

// Generate key pair
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Save key and certificate (self-signed)
fs.writeFileSync('ssl/localhost-key.pem', privateKey);
fs.writeFileSync('ssl/localhost.pem', publicKey);

console.log('Self-signed key and certificate generated in ssl/ folder');
