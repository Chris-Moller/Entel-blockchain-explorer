import VoteButton from "./VoteButton.jsx";

// const callUpvote = async () => {
//   try {
//     const res = await setDescription(selectedFunc, walletAddy, draftDescription);
//     setErrorMessage(null);
//     console.log(res)
//   } catch (err) {
//     setErrorMessage(err.message)
//   }
// };




const DescriptionView = ({ descriptionObj, walletAddy,  setErrorMessage}) => {

  return (
    <div className={`function-box`}>
      <VoteButton descriptionObj={descriptionObj} walletAddy={walletAddy} setErrorMessage={setErrorMessage} />
      <div className={`left-align function-container`}>
        <p className="tiny-text">{`Posted by ${descriptionObj.author}, on ${descriptionObj.date }`}</p>
        <div className="description">{descriptionObj.content ? descriptionObj.content : "No description found"}</div>
      </div>
    </div>
  );
};

export default DescriptionView;
