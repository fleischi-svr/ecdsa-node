const secp = require("ethereum-cryptography/secp256k1");
const utils = require("ethereum-cryptography/utils");
const keccak = require("ethereum-cryptography/keccak");
const prompt = require("prompt-sync")({ sigint: true });

const privKey = prompt("Please enter your private Key: ");
const hashHex = prompt("Please enter the hash you want to sign (Hex): ");
//const privKey =
//  "3c008f9706b96c62eb2ba05c7dd246672920111711345691d0a4bafee28c7869";
//const hashHex =
//  "08003bd1b4c2eaeac818a3f128225ef562e15a915f30f746a433d437aa916b25";

const sig = secp.sign(hashHex, privKey, { recovered: true });

sig.then((sig) => {
  const [signature, reBit] = sig;
  console.log(
    "signature: ",
    utils.bytesToHex(signature),
    "| recoveryBit: ",
    reBit
  );
});

module.exports = async function generateSignature(privateKey, message) {
  //how to sign 1x1
  // 1 get a message you want to sign (utf8ToBytes)
  // 2 hash the message you want to sign (keccak256)
  // 3 use secp to sign the message // secp.sign(hash,PRIVATE_KEY,{recovered:true})
  const messageInBytes = utils.utf8ToBytes(String(message));
  const hash = keccak.keccak256(messageInBytes);
  const [signature] = await secp.sign(hash, privateKey, { recovered: true });
  return signature;
};
