import { set } from "firebase/database";
import { useEffect } from "react";
import { useState } from "react";
import { BsBookmarkStar, BsBookmarkStarFill } from "react-icons/bs";
import { toggleStar } from "../util/interact";
const StarButton = ({ contractFuncObj }) => {
  const [isStarred, setStarred] = useState(false);

  useEffect(() => {
    if (
      window.ethereum &&
      window.ethereum.selectedAddress &&
      contractFuncObj.stars.has(window.ethereum.selectedAddress)
    ) {
      setStarred(true);
    } else {
      setStarred(false);
    }
  });

  const starClicked = async (e) => {
    e.stopPropagation()
    await toggleStar(
      contractFuncObj.contractAddy,
      contractFuncObj.id,
      !isStarred
    );
  };
  return (
    <div className="star-div">
      <button className="star-button" onClick={starClicked}>
        {isStarred ? <BsBookmarkStarFill/> : <BsBookmarkStar />}
        <div className="star-count">{contractFuncObj.stars.size}</div>
      </button>
    </div>
  );
};

export default StarButton;
