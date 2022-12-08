const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");

class User {
  constructor(privateKey, publicKey, address) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.address = address;
  }
}

module.exports = function genUser() {
  const privateKey = utils.toHex(secp.utils.randomPrivateKey());
  const publicKey = utils.toHex(secp.getPublicKey(privateKey));
  const address = utils.toHex(
    utils.utf8ToBytes(publicKey.slice(publicKey.length - 20))
  );
  return new User(privateKey, publicKey, address);
};
