import { useState } from "react";
import { getAddyShorthand } from "../util/interact.js";
import SuggestForm from "./SuggestForm.jsx";

const ContractBanner = ({
  name,
  description,
  address,
  website,
  docs,
  author,
  timestamp,
}) => {
  const [isEditing, setEditing] = useState(false);

  const suggestButtonHandler = () => {
    setEditing(true);
  };

  return (
    <div className="contract-banner">
      {/* TODO: consider adding metrics that indicate popularity of this contract # page views, # func calls, etc, and token tracker */}
      <div className="eight-hundo-banner">
        {isEditing ? (
          <SuggestForm
            name={name}
            description={description}
            website={website}
            docs={docs}
            setEditing={setEditing}
            address={address}
          />
        ) : (
          <div>
            <h2 style={{ display: "flex" }}>
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
              >
                {name ? `${name}` : `Contract`}{" "}
                {`(${getAddyShorthand(address)})`}
              </a>
              {name ? (
                <button onClick={suggestButtonHandler} id="edit-suggest">
                  Suggest
                </button>
              ) : (
                <button onClick={suggestButtonHandler} id="edit-suggest">
                  Edit
                </button>
              )}
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ color: "gray", fontSize: "10pt" }}>
                {author ? `Last edited by ${author} on ${timestamp}` : null}
              </span>
              <span style={{ marginBottom: "10px" }}>
                {description ? description : "No description found."}
              </span>
            </div>

            <div
              className="tiny-text"
              style={{
                textTransform: "uppercase",
                fontWeight: "bold",
                right: "auto",
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ paddingRight: "20px" }}>
                  <a href={website}>🔗 Website </a>
                </div>
                <div>
                  <a href={docs}>📄 Docs</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractBanner;
