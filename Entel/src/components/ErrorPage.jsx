import background from "../images/Error-search.png";
import { RiErrorWarningFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Loader from "./Loader";
import { useEffect } from "react";

const ErrorPage = ({
  contractAddy,
  setContractAddy,
  network,
  setNetwork,
  walletAddress,
  setWallet,
  setErrorMessage,
  errorMessage,
  setLoading,
  isLoading,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const backHomeHandler = () => {
    setErrorMessage(null);
    navigate("/");
  };
  
  useEffect(() => {
    setErrorMessage(location.state.errorMessage);
    setLoading(false);
  })

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar
            contractAddy={contractAddy}
            setContractAddy={setContractAddy}
            network={network}
            setNetwork={setNetwork}
            walletAddress={walletAddress}
            setWallet={setWallet}
            setErrorMessage={setErrorMessage}
            setLoading={setLoading}
          />
          <div
            style={{
              backgroundColor: "rgb(19 0 41)",
              backgroundImage: `url(${background})`,
              height: "100vh",
              background: "cover",
              backgroundRepeat: "no-repeat",
              display: "flex",
            }}
          >
            {errorMessage ? (
              <div className="no-Address-div">
                <div className="align-row">
                  <h2>Error</h2>
                  <RiErrorWarningFill className="err-warning-icon"></RiErrorWarningFill>
                </div>
                <span className="err-warning-p">{errorMessage}</span>
                <button onClick={backHomeHandler} className="no-addy-button">
                  Back Home
                </button>
              </div>
            ) : (
              <div className="no-Address-div">
                <div className="align-row">
                  <h2>Address not found</h2>
                  <RiErrorWarningFill className="err-warning-icon"></RiErrorWarningFill>
                </div>
                <span className="err-warning-p">
                  Whoops! Looks like you forgot to enter a contract address.
                </span>
                <button onClick={backHomeHandler} className="no-addy-button">
                  Back Home
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ErrorPage;
