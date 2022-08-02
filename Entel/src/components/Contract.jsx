import { useEffect, useState } from "react";
import ContractFunction from "./ContractFunction.jsx";
import {
  getContractABI,
  initContract,
  getABIFunctions,
  getAllFunctionDescriptions,
  getContractMetadata,
  checkProxy,
  updateProxyAddress,
  updateFunctionStars,
} from "../util/interact.js";
import { getDatabase, ref, onValue } from "firebase/database";
import ContractBanner from "./ContractBanner.jsx";
import FilterFunctions from "./FilterFunctions.jsx";
import ContractFunctionObj from "../classes/ContractFunctionObj.js";
import Navbar from "./Navbar.jsx";
import Loader from "./Loader.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const Contract = ({
  address,
  network,
  errorMessage,
  setErrorMessage,
  setSelectedFunc,
  setContractAddy,
  setNetwork,
  walletAddress,
  setWallet,
  contractObj,
  setContract,
  isLoading,
  setLoading,
}) => {
  const [abi, setABI] = useState(null);

  const [implementationAddy, setImplementationAddy] = useState(null);

  const [loadFunctions, setLoadFunctions] = useState(null);

  const [allFunctions, setAllFunctions] = useState(null);
  const [displayFunctions, setDisplayFunctions] = useState(null);

  const [metadata, setMetadata] = useState(null);
  const [isProxy, setProxy] = useState(false);
  const cAddress = useParams();
  let navigate = useNavigate();

  const sorted = (funcRes) => {
    funcRes.sort((a, b) =>
      a.stars.size < b.stars.size ? 1 : b.stars.size < a.stars.size ? -1 : 0
    );
    return funcRes;
  };

  const load = async () => {
    try {
      setContractAddy(cAddress.address);
      const abiRes = await getContractABI(address, network);
      checkProxy(abiRes) ? setProxy(true) : setProxy(false);
      // setProxy(false)
      // if(checkProxy(abiRes)){
      //   setProxy(true)
      // }
      console.log(`isProxy: ${isProxy}`);
      setABI(abiRes);
      const funcRes = getABIFunctions(abiRes, address, network);
      const contractRes = await initContract(address, abiRes, network);
      const funcDescr = await getAllFunctionDescriptions(address);
      const meta = await getContractMetadata(address);
      setMetadata(meta);
      setContract(contractRes);
      setLoadFunctions(funcRes);
      setAllFunctions(funcRes);
      setDisplayFunctions(funcRes);
      setErrorMessage(null);
      setLoading(false);
    } catch (err) {
      setABI(null);
      setContract(null);
      setMetadata(null);
      setLoadFunctions(null);
      setAllFunctions(null);
      setDisplayFunctions(null);
      console.log(err);
      setErrorMessage(err.message);
      navigate(`/address/${cAddress.address}/e=`, {
        state: { errorMessage: err.message },
      });
      setLoading(true);

      
    }
  };

  // useEffect for loading everything
  useEffect(() => {
    load();
  }, [address, network]);

  // useEffect for loading + updating stars
  const db = getDatabase();
  useEffect(() => {
    const starCountRef = ref(db, "Stars/" + address);
    const unsubscribeStars = onValue(starCountRef, (snapshot) => {
      const stars = snapshot.val();
      const newFuncs = updateFunctionStars(stars, loadFunctions);
      if (loadFunctions) {const defaultSort = newFuncs.sort((a, b) =>
        a.stars.size < b.stars.size ? 1 : b.stars.size < a.stars.size ? -1 : 0
      );
        setAllFunctions(defaultSort);
        setDisplayFunctions(defaultSort);}
        

    });
    
    return () => {
      unsubscribeStars();
    };
    
  }, [loadFunctions]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {contractObj ? (
            <div>
              <Navbar
                contractAddy={address}
                setContractAddy={setContractAddy}
                network={network}
                setNetwork={setNetwork}
                walletAddress={walletAddress}
                setWallet={setWallet}
                setErrorMessage={setErrorMessage}
                setLoading={setLoading}
              />
              <ContractBanner
                name={metadata ? metadata.name : null}
                description={metadata ? metadata.description : null}
                address={address}
                website={metadata ? metadata.website : null}
                docs={metadata ? metadata.docs : null}
                author={metadata ? metadata.author : null}
                timestamp={metadata ? metadata.date : null}
              />
            </div>
          ) : null}
          <div className="container-main">
            {displayFunctions ? (
              <div className="eight-hundo">
                {isProxy ? (
                  <div className="proxy">
                    <span>
                      😲 This may be a proxy contract. If you know it's
                      implementation address, enter it below:
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        autoFocus="autofocus"
                        className="search-input"
                        placeholder="implementation address"
                        value={null}
                        onChange={(e) => setImplementationAddy(e.target.value)}
                      ></input>
                      <button
                        onClick={(e) =>
                          updateProxyAddress(address, implementationAddy)
                        }
                      >
                        set
                      </button>
                    </div>
                  </div>
                ) : null}

                <FilterFunctions
                  setDisplayFunctions={setDisplayFunctions}
                  allFunctions={allFunctions}
                />

                {displayFunctions.map((func, i) => {
                  return (
                    <ContractFunction
                      key={i}
                      contract={contractObj}
                      contractFuncObj={func}
                      setSelectedFunc={setSelectedFunc}
                      network={network}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Contract;
