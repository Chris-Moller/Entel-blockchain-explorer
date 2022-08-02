import SearchContractBar from "./SearchContractBar";
import WalletButton from "./WalletButton";

const Navbar = ({
  contractAddy,
  setContractAddy,
  network,
  setNetwork,
  walletAddress,
  setWallet,
  setErrorMessage,
  setLoading
}) => {
  return (
    <div className="navbar">
      <div className="navbar-items-div">
        <SearchContractBar
          contractAddy={contractAddy}
          setContractAddy={setContractAddy}
          network={network}
          setNetwork={setNetwork}
          setLoading={setLoading}
        />
        <WalletButton
          walletAddress={walletAddress}
          setWallet={setWallet}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};

export default Navbar;
