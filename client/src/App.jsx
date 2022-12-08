import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Signature from "./Signature";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        signature={signature}
        setSignature={setSignature}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Signature setBalance={setBalance} />
    </div>
  );
}

export default App;
