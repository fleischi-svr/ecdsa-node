import { useState } from "react";
import server from "./server";
import * as utils from "ethereum-cryptography/utils";
import * as keccak from "ethereum-cryptography/keccak";
import { useEffect } from "react";

function Signature({ setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [nonce, setNonce] = useState(0);

  const [messageHash, setMessageHash] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState(0);

  const setValue = (setter) => (evt) => {
    setter(evt.target.value);
  };

  const disabledStyle = {
    color: "black",
    backgroundColor: "#dfe7e7",
  };

  const hashStyle = {
    color: "white",
    backgroundColor: "#319795",
    padding: "10px",
  };

  const createMessageHash = () => {
    const messageInBytes = utils.utf8ToBytes(recipient + sendAmount + nonce);
    const hash = keccak.keccak256(messageInBytes);
    setMessageHash(utils.toHex(hash));
  };

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        recipient: recipient,
        amount: parseInt(sendAmount),
        nonce: nonce,
        signature: signature,
        recoveryBit: recoveryBit,
      });
      setBalance(balance);
      setNonce((prev) => {
        return prev + 1;
      });
    } catch (ex) {
      alert(ex.response.data.message);
    }
    // make that only if ok / success comes back to increment
  }

  useEffect(() => {
    createMessageHash();
  }, [sendAmount, recipient, nonce]);

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Create Message Hash</h1>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>
      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <label>
        Nonce
        <input
          style={disabledStyle}
          placeholder="Increment Nonce after each Transfer"
          value={nonce}
          type="number"
          onChange={setValue(setNonce)}
          disabled
        ></input>
      </label>

      {messageHash && (
        <div>
          <h3>Message Hash (Hex):</h3>
          <p style={hashStyle}>{messageHash}</p>
        </div>
      )}

      <h1>Send Transaction</h1>

      <label>
        Signature
        <input
          placeholder="Type in a Signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>
      <label>
        Recovery Bit
        <input
          placeholder="Type in a RecoveryBit"
          value={recoveryBit}
          type="number"
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Signature;
