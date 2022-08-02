import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  runTransaction,
} from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import ContractFunctionObj from "../classes/ContractFunctionObj.js";
import { useState } from "react";
const { ethers } = require("ethers");
require('dotenv').config()

const keyMap = {
  mainnet: process.env.REACT_APP_ALCHEMY_MAINNET,
  rinkeby: process.env.REACT_APP_ALCHEMY_RINKEBY,
  ropsten: process.env.REACT_APP_ALCHEMY_ROPSTEN,
  goerli: process.env.REACT_APP_ALCHEMY_GOERLI,
  kovan: process.env.REACT_APP_ALCHEMY_KOVAN,
};

const downloadMetamask = "https://metamask.io/download.html";

const firebaseConfig = {
  apiKey: "AIzaSyDZXeUzRW4EGzjr2PJMLVZdyuSxTncSGzE",
  authDomain: "hackmoney-6ef38.firebaseapp.com",
  databaseURL: "https://hackmoney-6ef38-default-rtdb.firebaseio.com/",
  projectId: "hackmoney-6ef38",
  storageBucket: "hackmoney-6ef38.appspot.com",
  messagingSenderId: "703593056992",
  appId: "1:703593056992:web:137854bf0299b2436a9e85",
  measurementId: "G-T8FP3JZE4J",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export const getContractABI = async (address, network) => {
  let req = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`;

  if (network !== "mainnet") {
    req = `https://api-${network}.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`;
  }
  const abi = await axios.get(req);

  var st = JSON.stringify(abi.data.result);
  var isProxy = false;

  if (
    st.search("upgradeToAndCall") != -1 ||
    st.search("newImplementation") != -1 ||
    st.search("upgradeToAndCall")
  ) {
    isProxy = true;
  }
  return abi.data.result;
};

export const checkProxy = (abi) => {
  var json = JSON.stringify(abi);
  var isProxy = false;

  if (
    (json.search("upgradeToAndCall") != -1 &&
      json.search("newImplementation") != -1 &&
      json.search("upgradeToAndCall")) ||
    (json.search("proxyType") != -1 && json.search("implementation") != -1) ||
    json.search("implementation") == 1
  ) {
    isProxy = true;
  }
  console.log(json.search("implementation"));

  return isProxy;
  console.log("HELLO");
};

export const updateProxyAddress = async (
  contractAddress,
  implementationAddress
) => {
  const metadataRef = ref(db);

  console.log(contractAddress, implementationAddress);
  try {
    const snapshot = await get(
      child(metadataRef, `Contracts/${contractAddress}/metadata/isProxy`)
    );

    if (snapshot.exists()) {
      return;
    }

    const proxyRef = ref(db, "Contracts/" + contractAddress + "/metadata");
    set(proxyRef, {
      isProxy: true,
      implementationAddress: implementationAddress,
    });
    console.log(db);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

//TODO: go back, might be stripping arrays and such which we'll want to index into
export const getABIFunctions = (abi, contractAddress, network) => {
  if (contractAddress !== "") {
    try {
      const parsedFunctions = JSON.parse(abi).filter(
        (elem) => elem.type === "function"
      );

      // const functions = {};
      const functions = [];

      for (let i = 0; i < parsedFunctions.length; i++) {
        const obj = parsedFunctions[i];
        const id = getHeaderHash(
          obj.inputs,
          obj.name,
          contractAddress,
          network
        );
        const body = new ContractFunctionObj(
          id,
          contractAddress,
          network,
          obj.name,
          obj.inputs,
          obj.outputs,
          obj.stateMutability,
          obj.stateMutability === "pure" || obj.stateMutability === "view",
          new Set()
        );

        functions.push(body);
      }
      return functions;
    } catch (err) {
      console.log(err.message);
      const e = new Error(String(abi));
      e.name = "FunctionError";
      throw e;
    }
  }
};

export const initContract = async (address, abi, network) => {
  if (address !== "") {
    const key = keyMap[network];
    const alchemy = `https://eth-${network}.alchemyapi.io/v2/${key}`;
    const customProvider = new ethers.providers.JsonRpcProvider(alchemy);
    const contract = new ethers.Contract(address, abi, customProvider);
    return contract;
  }
};

export const getInternalTxns = async (txAddy, network) => {
  const key = keyMap[network];
  const alchemy = `https://eth-${network}.alchemyapi.io/v2/${key}`;

  try {
    const res = await axios.post(alchemy, {
      jsonrpc: "2.0",
      method: "trace_transaction",
      params: [txAddy],
      id: 1,
    });
    return res.data.result;
  } catch (err) {
    console.log(err);
  }
};

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Enter a contract address in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error(
      "You must install Metamask, a virtual Ethereum wallet, in your browser."
    );
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
        };
      } else {
        //STOOPPED HERE
        throw new Error("🦊 Connect to Metamask using the top right button.");
      }
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error(
      "You must install Metamask, a virtual Ethereum wallet, in your browser."
    );
  }
};

export const writeFunction = async (contract, funcName, funcInputs) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(); // TODO, change so don't have to connect on each call
    const newContract = contract.connect(signer);
    const res = await newContract.functions[funcName](...funcInputs);
    await res.wait()
    return res;
  } catch (e) {
    throw e;
  }
};

export const setDescription = async (selectedFunction, walletAddy, descr) => {
  const contractAddress = String(selectedFunction.contractAddy);
  const headerHash = String(selectedFunction.id);

  try {
    if (!walletAddy) {
      const e = new Error(
        "You must be signed in with your wallet to submit a description."
      );
      e.name = "WalletError";
      throw e;
    }

    const descripRef = ref(
      db,
      "Contracts/" +
        contractAddress +
        "/functions/" +
        headerHash +
        "/descriptions"
    );
    const newDescripRef = push(descripRef);
    set(newDescripRef, {
      author: walletAddy,
      content: descr,
      date: new Date().toDateString(),
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const suggestContractInfo = async (submitObj, walletAddy, contractAddy) => {
  const contractAddress = String(contractAddy);
  try {
    if (!walletAddy) {
      const e = new Error(
        "You must be signed in with your wallet to submit a description."
      );
      e.name = "WalletError";
      throw e;
    }

    const metaRef = ref(
      db,
      "Suggestions/" +
        contractAddress +
        "/metadataSuggestion"
    );
    const metaSuggestion = push(metaRef);
    set(metaSuggestion, {
      contract: contractAddress,
      description: submitObj.description,
      docs: submitObj.docs,
      name: submitObj.name,
      website: submitObj.website,
      changelog: submitObj.changelog,
      author: walletAddy,
      date: new Date().toDateString(),
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const editContractInfo = async (submitObj, walletAddy, contractAddy) => {
  const contractAddress = String(contractAddy);
  try {
    if (!walletAddy) {
      const e = new Error(
        "You must be signed in with your wallet to submit a description."
      );
      e.name = "WalletError";
      throw e;
    }

    const metaRef = ref(
      db,
      "Contracts/" +
        contractAddress +
        "/metadata"
    );

    set(metaRef, {
      description: submitObj.description,
      docs: submitObj.docs,
      name: submitObj.name,
      website: submitObj.website,
      author: walletAddy,
      date: new Date().toDateString(),
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

};

export const getContractMetadata = async (contractAddress) => {
  if (contractAddress !== "") {
    const metadataRef = ref(db);

    try {
      const snapshot = await get(
        child(metadataRef, `Contracts/${contractAddress}/metadata`)
      );

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }
};

export const toggleStar = async (contractAddress, hash, value) => {
  if (!window.ethereum || !window.ethereum.selectedAddress) {
    const e = new Error(
      "You must be signed in with your wallet to star a function."
    );
    e.name = "WalletError";
    throw e;
  }
  const walletAddy = window.ethereum.selectedAddress;

  const path = "Stars/" + contractAddress + "/" + hash + "/" + walletAddy;
  const starRef = ref(db, path);

  try {
    if (value) {
      await set(starRef, true);
    } else {
      await set(starRef, null);
    }
  } catch (e) {
    throw e;
  }
};

export const updateFunctionStars = (stars, allFunctions) => {
  const newFns = [];

  if (allFunctions) {
    for (const fn of allFunctions) {
      if (stars[fn.id]) {
        const updatedStars = Object.keys(stars[fn.id]);
        const s = new Set(updatedStars);
        fn.setStars(s);
        newFns.push(fn);
      } else {
        fn.setStars(new Set());
        newFns.push(fn);
      }
    }
  }
  if (newFns.length > 0) {
    return newFns;
  } else {
    return allFunctions;
  }
};

//TODO: get description stored in IPFS that has highest upvotes/downvotes
export const getSingleFunctionDescrip = async (contractAddress, hash) => {
  const funcDescrRef = ref(db);

  try {
    // get first element stored in DB
    const snapshot = await get(
      child(
        funcDescrRef,
        "Contracts/" + contractAddress + "/functions/" + hash + "/descriptions"
      ),
      limitToFirst(1)
    );
    if (snapshot && snapshot.val()) {
      const data = snapshot.val();
      const key = Object.keys(data)[0];
      if (data[key].upvotes) {
        console.log(Object.keys(data[key].upvotes));
      }
      
      return data[key].content;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

//Reference: https://firebase.google.com/docs/database/web/read-and-write#save_data_as_transactions
//TODO: might be worth consolidating upvote and downvote func into one
export const upVote = async (
  contractAddress,
  hash,
  descriptionID,
  walletAddy
) => {
  if (!walletAddy) {
    const e = new Error(
      "You must be signed in with your wallet to upvote a description."
    );
    e.name = "WalletError";
    throw e;
  }
  const path =
    "Contracts/" +
    contractAddress +
    "/functions/" +
    hash +
    "/descriptions/" +
    descriptionID;
  const voteRef = ref(db, path);

  try {
    const res = await runTransaction(voteRef, (description) => {
      if (description) {
        if (description.upvotes && description.upvotes[walletAddy]) {
          //if in upvotes already, remove it (toggle)
          description.upvotes[walletAddy] = null;
        } else {
          // if not in upvotes
          if (!description.upvotes) {
            //check if upvotes array exists, otw create it
            description.upvotes = {};
          }
          description.upvotes[walletAddy] = true;

          if (description.downvotes && description.downvotes[walletAddy]) {
            // if in downvotes, set as null
            description.downvotes[walletAddy] = null;
          }
        }
      }
      return description;
    });
    const snapshot = res.snapshot;
    if (snapshot && snapshot.val()) {
      // return the updated data
      const data = snapshot.val();
      return data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const downVote = async (
  contractAddress,
  hash,
  descriptionID,
  walletAddy
) => {
  if (!walletAddy) {
    const e = new Error(
      "You must be signed in with your wallet to downvote a description."
    );
    e.name = "WalletError";
    throw e;
  }
  const path =
    "Contracts/" +
    contractAddress +
    "/functions/" +
    hash +
    "/descriptions/" +
    descriptionID;
  const voteRef = ref(db, path);

  try {
    const res = await runTransaction(voteRef, (description) => {
      if (description) {
        if (description.downvotes && description.downvotes[walletAddy]) {
          //if in downvotes already, remove it (toggle)
          description.downvotes[walletAddy] = null;
        } else {
          // if not in upvotes
          if (!description.downvotes) {
            //check if downvotes array exists, otw create it
            description.downvotes = {};
          }
          description.downvotes[walletAddy] = true;

          if (description.upvotes && description.upvotes[walletAddy]) {
            // if in upvotes, set as null
            description.upvotes[walletAddy] = null;
          }
        }
      }
      return description;
    });
    const snapshot = res.snapshot;
    if (snapshot && snapshot.val()) {
      // return the updated data
      const data = snapshot.val();
      return data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getAllFunctionDescriptions = async (contractAddress) => {
  const funcDescrRef = ref(db);

  try {
    const snapshot = await get(
      child(funcDescrRef, `Contracts/${contractAddress}/functions`)
    );
    const data = snapshot.val();
    return data;
  } catch (e) {
    console.log(e);
    return e.message;
  }
};

export const getHeaderHash = (funcInputs, name, address, network) => {
  let headerHash = name + address + network;
  for (let j = 0; j < funcInputs.length; j++) {
    headerHash += funcInputs[j].name;
  }
  headerHash = ethers.utils.id(headerHash);
  return headerHash;
};

export const getAddyShorthand = (address) => {
  return (
    String(address).substring(0, 6) + "..." + String(address).substring(38)
  );
};

export const getENS = async (walletAddy) => {
  const key = keyMap.mainnet;
  const alchemy = `https://eth-mainnet.alchemyapi.io/v2/${key}`;
  const customProvider = new ethers.providers.JsonRpcProvider(alchemy);
  const res = await customProvider
    .lookupAddress(walletAddy)
    .then((resolvedName) => {
      return resolvedName ?? walletAddy;
    });
  return res;
};
