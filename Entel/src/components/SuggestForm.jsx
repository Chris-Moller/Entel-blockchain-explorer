import {
  getCurrentWalletConnected,
  getENS,
  suggestContractInfo,
  editContractInfo,
} from "../util/interact.js";
import { useRef, useState, useEffect } from "react";

const SuggestForm = ({
  name,
  description,
  website,
  docs,
  setEditing,
  address,
}) => {
  const formName = useRef(null);
  const formDesc = useRef(null);
  const formWebsite = useRef(null);
  const formDocs = useRef(null);
  const formChangeLog = useRef(null);
  const [ens, setENS] = useState("");
  const [loadingDone, setLoadingDone] = useState(false);

  //TODO: Remove this duplicate "ENS" state (can also be found in EditView.jsx)
  const checkENS = async () => {
    const address = await getCurrentWalletConnected();
    if (address.address > 0) {
      const ensResponse = await getENS(address.address);
      setENS(ensResponse);
    }
  };

  const submitSuggestHandler = async (e) => {
    e.preventDefault();
    const subObj = {
      name: formName.current.value,
      description: formDesc.current.value,
      website: formWebsite.current.value,
      docs: formDocs.current.value,
      changelog: formChangeLog.current.value,
    };
    try {
      await suggestContractInfo(subObj, ens, address);
      setLoadingDone(true);
      setTimeout(() => {
        setEditing(false);
      }, 2700);
    } catch (error) {
      console.log(error);
    }
  };

  const submitEditHandler = async (e) => {
    e.preventDefault();
    const subObj = {
      name: formName.current.value,
      description: formDesc.current.value,
      website: formWebsite.current.value,
      docs: formDocs.current.value,
    };
    try {
      await editContractInfo(subObj, ens, address);
      setLoadingDone(true);
      setTimeout(() => {
        setEditing(false);
      }, 2700);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkENS();
  }, []);

  return (
    <>
      {loadingDone ? (
        <div className="loading-form" style={{ margin: "auto" }}>
            {" "}
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              {" "}
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />{" "}
              <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
      ) : (
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={name ? submitSuggestHandler : submitEditHandler}
        >
          {name ? (
            <>
              <input
                required={true}
                className="title-suggest"
                type="text"
                defaultValue={name}
                spellCheck={false}
                ref={formName}
              ></input>
              <textarea
                required={true}
                className="suggest-contract-desc"
                defaultValue={description}
                maxLength="400"
                ref={formDesc}
              ></textarea>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    width: "50%",
                    marginRight: "10px",
                    fontWeight: "600",
                    color: "rgb(90, 17, 186)",
                  }}
                >
                  Website
                </div>
                <div
                  style={{
                    width: "50%",
                    fontWeight: "600",
                    color: "rgb(90, 17, 186)",
                  }}
                >
                  Docs
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "5px",
                }}
              >
                <input
                  required={true}
                  className="title-suggest-website"
                  type="text"
                  defaultValue={website}
                  spellCheck={false}
                  ref={formWebsite}
                ></input>
                <input
                  className="title-suggest-docs"
                  type="text"
                  required={true}
                  defaultValue={docs}
                  spellCheck={false}
                  ref={formDocs}
                ></input>
              </div>
              <textarea
                required={true}
                className="suggest-contract-desc-changelog"
                placeholder="Briefly tell us what you updated..."
                maxLength="400"
                ref={formChangeLog}
              ></textarea>
            </>
          ) : (
            <>
              <input
                className="title-suggest"
                type="text"
                placeholder="Write a name here..."
                spellCheck={false}
                ref={formName}
                required={true}
              ></input>
              <textarea
                className="suggest-contract-desc"
                placeholder="Write a description here..."
                maxLength="400"
                required={true}
                ref={formDesc}
              ></textarea>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    width: "50%",
                    marginRight: "10px",
                    fontWeight: "600",
                    color: "rgb(90, 17, 186)",
                  }}
                >
                  Website
                </div>
                <div
                  style={{
                    width: "50%",
                    fontWeight: "600",
                    color: "rgb(90, 17, 186)",
                  }}
                >
                  Docs
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "5px",
                }}
              >
                <input
                  className="title-suggest-website"
                  type="text"
                  placeholder="optional"
                  spellCheck={false}
                  ref={formWebsite}
                ></input>
                <input
                  className="title-suggest-docs"
                  type="text"
                  placeholder="optional"
                  spellCheck={false}
                  ref={formDocs}
                ></input>
              </div>
            </>
          )}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              id="suggest-read-button"
              style={{
                marginRight: "8px",
                marginLeft: "auto",
                marginTop: "10px",
              }}
              onClick={() => {
                setEditing(false);
              }}
            >
              Cancel
            </button>
            <button
              id="suggest-read-button"
              style={{ marginTop: "10px" }}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default SuggestForm;
