import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contract from "./components/Contract";
import EditView from "./components/EditView";
import ErrorMessage from "./components/ErrorMessage";
import NotFound from "./components/NotFound";
import ErrorPage from "./components/ErrorPage.jsx";
import HomeSearch from "./components/HomeSearch.jsx";
function App() {
  const [contractAddy, setContractAddy] = useState("");

  const [network, setNetwork] = useState("mainnet");
  const [contractObj, setContract] = useState(null);

  //wallet stuff
  const [walletAddress, setWallet] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedFunc, setSelectedFunc] = useState(null);
  const [isLoading, setLoading] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <HomeSearch
                isLoading={isLoading}
                setLoading={setLoading}
                contractAddy={contractAddy}
                setContractAddy={setContractAddy}
                network={network}
                setNetwork={setNetwork}
                contractObj={contractObj}
              />
            }
          ></Route>
          <Route
            exact
            path="/address"
            element={
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
              />
            }
          />
          <Route
            exact
            path="/address/:error/e="
            element={
              <ErrorMessage
                errorMessage={errorMessage}
                contractAddy={contractAddy}
                setContractAddy={setContractAddy}
                network={network}
                setNetwork={setNetwork}
                walletAddress={walletAddress}
                setWallet={setWallet}
                setErrorMessage={setErrorMessage}
                setLoading={setLoading}
                isLoading={isLoading}
              />
            }
          />
          <Route
            exact
            path="/address/:address"
            element={
              <Contract
                address={contractAddy}
                network={network}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setSelectedFunc={setSelectedFunc}
                setContractAddy={setContractAddy}
                setNetwork={setNetwork}
                walletAddress={walletAddress}
                setWallet={setWallet}
                contractAddy={contractAddy}
                contractObj={contractObj}
                setContract={setContract}
                isLoading={isLoading}
                setLoading={setLoading}
              />
            }
          />
          <Route
            exact
            path="address/:address/edit/:funcid"
            element={
              <EditView
                walletAddy={walletAddress}
                contractAddy={contractAddy}
                network={network}
                setErrorMessage={setErrorMessage}
                setSelectedFunc={setSelectedFunc}
                selectedFunc={selectedFunc}
                setNetwork={setNetwork}
                walletAddress={walletAddress}
                setContractAddy={setContractAddy}
                setWallet={setWallet}
              />
            }
          />
          <Route path="*" exact={true} element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
