const crypto = require('crypto');
const forge = require('node-forge');

/**
 * Create a random key that can be used for signing tokens
 * @param keyLength - the required byte of key to be generated
 * @returns {string} - the key returned form the function
 */
const key = (keyLength) => crypto.randomBytes(keyLength)
  .toString('hex');

// /**
//  * Encrypt 3DES using Node.js's crypto module *
//  * @param data A utf8 string
//  * @param keyToEncryptWith Key would be hashed by md5 and shorten to maximum of 192 bits,
//  * @returns {*} A base64 string
//  */
// const encrypt3DES = (data, keyToEncryptWith) => {
//   const md5Key = crypto.createHash('md5')
//   .update(keyToEncryptWith)
//   .digest('hex')
//   .substr(0, 24);
//   const cipher = crypto.createCipheriv('des-ede3', md5Key, '');
//
//   let encrypted = cipher.update(data, 'utf8', 'base64');
//   encrypted += cipher.final('base64');
//   return encrypted;
// };

function encrypt3DES(keyToEncryptWith, text) {
  const cipher = forge.cipher.createCipher(
    '3DES-ECB',
    forge.util.createBuffer(keyToEncryptWith),
  );
  cipher.start({ iv: '' });
  cipher.update(forge.util.createBuffer(text, 'utf-8'));
  cipher.finish();
  const encrypted = cipher.output;
  return forge.util.encode64(encrypted.getBytes());
}

module.exports = {
  key,
  encrypt3DES,
};
