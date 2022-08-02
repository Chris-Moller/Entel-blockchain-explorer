import { useEffect } from "react";

import ErrorPage from "./ErrorPage.jsx";

const ErrorMessage = ({
  contractAddy,
  setContractAddy,
  network,
  setNetwork,
  walletAddress,
  setWallet,
  setLoading,
  isLoading,
  setErrorMessage,
  errorMessage,
}) => {

  return (
    <>
      <ErrorPage
        contractAddy={contractAddy}
        setContractAddy={setContractAddy}
        network={network}
        setNetwork={setNetwork}
        walletAddress={walletAddress}
        setWallet={setWallet}
        setErrorMessage={setErrorMessage}
        setLoading={setLoading}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default ErrorMessage;
