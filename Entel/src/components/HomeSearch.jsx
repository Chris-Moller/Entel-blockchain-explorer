import { useEffect, useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import backgroundHome from "../images/home-search.png";

const HomeSearch = ({
  contractAddy,
  setContractAddy,
  network,
  setNetwork,
  contractObj,
  isLoading,
  setLoading,
}) => {
  const [dest, setDest] = useState("");

  return (
    <div
      className="home-gradient"
      style={{
        backgroundImage: `url(${backgroundHome})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="home-main-container">
        <span className="cSearch-title">Ξntel Explorer</span>
        <div className="cSearch-div">
          <form className="cSearch-form" id="home-search">
            <Link
              onClick={() => {
                setLoading(true);
                setContractAddy(dest);
              }}
              style={{ display: "flex" }}
              to={`/address/${dest}`}
              state={{ cAddress: dest, loading: true }}
            >
              <button className="no-button">
                <BsSearch className="search-icon1" form="home-search" />
              </button>
            </Link>
            <input
              className="search-input-1"
              placeholder="search any contract address..."
              name="address"
              onChange={(e) => {setDest(e.target.value)}}
            ></input>
            <div style={{ display: "flex" }}>
              <select
                className="network-select2"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
              >
                <option value="mainnet">Mainnet</option>
                <option value="goerli">Goerli</option>
                <option value="kovan">Kovan</option>
                <option value="rinkeby">Rinkeby</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeSearch;
