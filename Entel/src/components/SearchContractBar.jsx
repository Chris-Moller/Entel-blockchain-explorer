import { useRef } from "react";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";

const SearchContractBar = ({
  setContractAddy,
  network,
  setNetwork,
  contractAddy,
  setLoading,
}) => {
  const [dest, setDest] = useState(contractAddy);
  const contractInput = useRef("");

  return (
    <div className="search-bar">
      <form className="search-box" id="form-submit">
        <Link
          onClick={() => {
            if (dest !== contractAddy){
              setLoading(true);
            }
            setContractAddy(dest);
          }}
          style={{ display: "flex" }}
          to={`address/${dest}`}
          state={{ cAddress: dest, loading: true }}
        >
          <button className="search-button">
            <BsSearch className="icon" form="form-submit" />
          </button>
        </Link>
        <input
          autoFocus="autofocus"
          className="search-input"
          name="address"
          placeholder="search any contract address"
          onChange={(e) => {
            setDest(e.target.value);
          }}
          ref={contractInput}
          defaultValue={contractAddy}
        ></input>
      </form>
      <div style={{ display: "flex", gap: "8px", marginLeft: "8px" }}>
        <select
          className="network-select"
          value={network}
          onChange={(e) => {
            setNetwork(e.target.value);
            setDest(contractInput.current.value);
          }}
        >
          <option value="mainnet">Mainnet</option>
          <option value="goerli">Goerli</option>
        </select>
      </div>
    </div>
  );
};

export default SearchContractBar;
