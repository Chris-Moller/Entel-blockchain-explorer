import { useState, useEffect } from "react";
import {
  BsFillCaretUpFill,
  BsCaretUp,
  BsFillCaretDownFill,
  BsCaretDown,
} from "react-icons/bs"; //https://react-icons.github.io/react-icons
import { upVote, downVote } from "../util/interact.js";

const VoteButton = ({ descriptionObj, walletAddy, setErrorMessage }) => {
  const [isUpvoted, setUpvote] = useState(false);
  const [isDownvoted, setDownvote] = useState(false);
  const [count, setCount] = useState(0);

  const upClicked = async (e) => {
    try {
      const response = await upVote(
        descriptionObj.contractAddy,
        descriptionObj.functionHash,
        descriptionObj.id,
        walletAddy
      );
      console.log(response);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const downClicked = async (e) => {
    try {
      const response = await downVote(
        descriptionObj.contractAddy,
        descriptionObj.functionHash,
        descriptionObj.id,
        walletAddy
      );
      console.log(response);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  // use effect for when count changes
  useEffect(() => {
    const numUpvotes = descriptionObj.upvotes
      ? Object.keys(descriptionObj.upvotes).length
      : 0;
    const numDownvotes = descriptionObj.downvotes
      ? Object.keys(descriptionObj.downvotes).length
      : 0;
    setCount(numUpvotes - numDownvotes);
    if (numUpvotes || numDownvotes === 0) {
      setUpvote(false);
      setDownvote(false);

    }

    if (descriptionObj.upvotes && descriptionObj.upvotes[walletAddy]) {
      setUpvote(true);
      setDownvote(false);
    } else if (
      descriptionObj.downvotes &&
      descriptionObj.downvotes[walletAddy]
    ) {
      setUpvote(false);
      setDownvote(true);
    }
  }, [descriptionObj]);

  return (
    <div className="star-div">
      <button className="star-button" onClick={upClicked}>
        {isUpvoted ? <BsFillCaretUpFill /> : <BsCaretUp />}
      </button>
      <span style={{ fontWeight: "700" }}>{count}</span>
      <button className="star-button" onClick={downClicked}>
        {isDownvoted ? <BsFillCaretDownFill /> : <BsCaretDown />}
      </button>
    </div>
  );
};

export default VoteButton;
