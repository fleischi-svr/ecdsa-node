const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const utils = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const keccak = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "3265633137643864666535623237636231336337": 50,
  "3637333465313935626236366361313065373534": 100,
  "3330353936383535623034343838613866616535": 75,
};
const pubKey2Nonce = {
  "04d0d9e18dd78b26e0d3517c6a08fedd64b1c862719367cc782385b958e16d8ac54da1aaef17169354e3c34d3230b835c764c29e507be12ec17d8dfe5b27cb13c7": 0,
  "04aedfd0be013f3f58acaa4d7b8ad712b4790b4f613374e5cbc95cbcfd5e52bd16e4a9b54996366575bfb778afe9ebbfaab64f7417eb656734e195bb66ca10e754": 0,
  "041d4ac050122e56991e09179100d5462249634ab464bfda71f0d6606b4905b4941c02b1e8929e283882cdc6728941f61ac58aae98514a30596855b04488a8fae5": 0,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, nonce, signature, recoveryBit } = req.body;

  const msgHashHex = createMessageHash(recipient, amount, nonce);
  let rBitNum = parseInt(recoveryBit);
  const pubKey = utils.toHex(
    secp.recoverPublicKey(msgHashHex, utils.hexToBytes(signature), rBitNum)
  );
  const sender = deriveAddressFromPubKey(pubKey);
  const goodSig = secp.verify(utils.hexToBytes(signature), msgHashHex, pubKey);
  if (goodSig) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    setInitialNonce(pubKey);

    if (pubKey2Nonce[pubKey] === 0) {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    } else if (nonce > pubKey2Nonce[pubKey]) {
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    } else {
      console.log(pubKey2Nonce[pubKey], ">", nonce);
      res.status(400).send({ message: "Can't use an old Signature" });
    }
  } else {
    res.status(400).send({ message: "Signature not correct" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
function setInitialNonce(pubKey) {
  if (!pubKey2Nonce[pubKey]) {
    pubKey2Nonce[pubKey] = 0;
  }
}

const deriveAddressFromPubKey = (pubKey) => {
  return (address = utils.toHex(
    utils.utf8ToBytes(pubKey.slice(pubKey.length - 20))
  ));
};

const createMessageHash = (recipient, sendAmount, nonce) => {
  const messageInBytes = utils.utf8ToBytes(recipient + sendAmount + nonce);
  const hash = keccak.keccak256(messageInBytes);
  return utils.toHex(hash);
};
