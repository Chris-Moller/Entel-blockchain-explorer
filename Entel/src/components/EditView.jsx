import { useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { setDescription, db } from "../util/interact.js";
import { useState, useMemo, useEffect, useCallback } from "react";
import { BsMinecartLoaded } from "react-icons/bs";
import DescriptionView from "./DescriptionView.jsx";
import { getContractABI, getABIFunctions, getCurrentWalletConnected, getENS } from "../util/interact.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  get,
  child,
  push,
  query,
  limitToLast,
  limitToFirst,
  orderByChild,
} from "firebase/database";
import ContractDescriptionObj from "../classes/ContractDescriptionObj.js";
import Navbar from "./Navbar.jsx";

const EditView = ({
  walletAddy,
  contractAddy,
  network,
  setErrorMessage,
  inputs,
  setSelectedFunc,
  selectedFunc,
  walletAddress,
  setNetwork,
  setContractAddy,
  setWallet
}) => {
  const { address, funcid } = useParams();
  const [draftDescription, setDraftDescription] = useState("");
  const [allDescrip, setAllDescrip] = useState(null);
  const [ens, setENS] = useState("");

  const checkENS = async () => {
    const address = await getCurrentWalletConnected();
    if (address.address > 0) {
  
      const ensResponse = await getENS((address.address))
      setENS(ensResponse);
      
    }
  
  }

  const handleInputChange = (e) => {
    const val = e.target.value;
    setDraftDescription(val);
  };

  const callSetDescription = async () => {
    try {
      await setDescription(selectedFunc, ens, draftDescription);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const load = async () => {
    checkENS()
    if (!selectedFunc) {
      await loadSelectedFunc();
    }
    await setupAllFunctionDescriptionsListener();
  };

  useEffect(() => {
    load();
  }, []);

  const loadSelectedFunc = async () => {
    try {
      const abiRes = await getContractABI(address, network);
      const funcRes = getABIFunctions(abiRes, address, network);
      setSelectedFunc(funcRes[funcid]);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const setupAllFunctionDescriptionsListener = async () => {
    const funcDescrRef = ref(
      db,
      "Contracts/" + address + "/functions/" + funcid + "/descriptions"
    );

    onValue(funcDescrRef, (snapshot) => {
      const data = snapshot.val();
      let descriptions = null;
      if (data) {
        descriptions = {};
        Object.keys(data).map((key, i) => {
          const description = data[key];
          descriptions[key] = new ContractDescriptionObj(
            key,
            description.author,
            description.content,
            description.date,
            selectedFunc ? selectedFunc.contractAddy : address,
            selectedFunc ? selectedFunc.id : funcid,
            description.upvotes,
            description.downvotes
          );
          
        });
      }
      setAllDescrip(descriptions);
      setDraftDescription("");
    });
  };

  return selectedFunc ? (
    <div>
    <Navbar
    contractAddy={contractAddy}
    setContractAddy={setContractAddy}
    network={network}
    setNetwork={setNetwork}
    walletAddress={walletAddress}
    setWallet={setWallet}
    setErrorMessage={setErrorMessage}
  />
    <div className="eight-hundo">

      <div className="edit-view">
        <h2>Suggest a description</h2>
        <p className="tiny-text tag">{selectedFunc.contractAddy}</p>
        <p className="tiny-text tag">
          {selectedFunc.isRead ? `Read 📖` : `Write 📝`}
        </p>

        <div>
          <code>
            <span className="bold">{selectedFunc.name}</span> →{" "}
            {selectedFunc.parseOutputsJSX(selectedFunc.outputs)}
          </code>
        </div>
        {selectedFunc.inputs ? (
          <div>
            {" "}
            {selectedFunc.inputs.map((obj, i) => (
              <div key={i}>
                <code>
                  ({obj.type}) {obj.name}
                </code>
              </div>
            ))}
          </div>
        ) : null}
        <div className="MDE-div">
          <textarea
            type="textarea"
            value={draftDescription}
            onChange={handleInputChange}
            placeholder="Enter a description..."
          />

          {/* <SimpleMDE
            value={value}
            onChange={onChange}
            getCodemirrorInstance={getCmInstanceCallback}
          /> */}
        </div>
        <button id="suggest-read-button" onClick={callSetDescription}>Submit</button>
      </div>
      {allDescrip ? (
        Object.keys(allDescrip).map((key, i) => {
          return (
            <DescriptionView
              key={i}
              descriptionObj={allDescrip[key]}
              walletAddy={walletAddy}
              setErrorMessage={setErrorMessage}
            />
          );
        })
      ) : (
        <p>No descriptions found</p>
      )}
    </div>
    </div>
  ) : (
    <>Nothing found</>
  );
  
};

export default EditView;
