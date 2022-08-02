import { connectWallet, getCurrentWalletConnected } from "../util/interact.js";
import { useEffect, useState } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { FaSignOutAlt } from "react-icons/fa";

const WalletButton = ({ walletAddress, setWallet, setErrorMessage }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  };

  const handleCopyClick = () => {
    copyTextToClipboard(walletAddress)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 700);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //wallet stuff
  const connectWalletPressed = async () => {
    if (walletAddress > 0) {
      handleCopyClick();
    }

    try {
      setErrorMessage(null);
      const walletResponse = await connectWallet();
      setWallet(walletResponse.address);

      // console.log(ensResponse)
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const changeWalletHandler = async (e) => {
    e.stopPropagation();
    if (window.ethereum) {
      await window.ethereum
        .request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        })
        .then(() =>
          window.ethereum.request({
            method: "eth_requestAccounts",
          })
        );
    } else {
      setErrorMessage(
        "You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  };

  // TODO: see if u can move to interact.js
  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setErrorMessage(null);
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    } else {
      setErrorMessage(
        "You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  }

  const load = async () => {
    try {
      setErrorMessage(null);
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      addWalletListener();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <button
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      id="walletButton"
      onClick={connectWalletPressed}
    >
      {walletAddress.length > 0 ? (
        <>
          <Jazzicon diameter={16} seed={jsNumberForAddress(walletAddress)} />
          <span style={{ marginLeft: "4px" }}>
            {isCopied
              ? "copied!"
              : String(walletAddress).substring(0, 6) +
                "..." +
                String(walletAddress).substring(38)}
          </span>
          <div className="disconnect-wallet">
            <FaSignOutAlt
              onClick={changeWalletHandler}
              style={{
                height: "18px",
                width: "18px",
                color: "#7300ff",
              }}
            />
          </div>
        </>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  );
};

export default WalletButton;
