import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { RiArrowDownSLine } from "react-icons/ri";
import {
  parseOutputsJSX,
  writeFunction,
  getSingleFunctionDescrip,
  getInternalTxns,
} from "../util/interact.js";
import StarButton from "./StarButton.jsx";
import TraceSwitch from "./TraceSwitch.jsx";

const ContractFunction = ({
  contract,
  contractFuncObj,
  setSelectedFunc,
  network,
}) => {
  const [functionResponse, setFunctionResponse] = useState("");
  const [errRes, setErrRes] = useState(null);
  const [traceRes, setTraceRes] = useState("");
  const [functionInputs, setFunctionInputs] = useState({});
  const [showFunctionInputs, setShowFunctionInputs] = useState(false);
  const [description, setDescription] = useState(null);
  const [toggled, setToggled] = useState(false);
  const [txPending, setPending] = useState(false);
  const inputsRef = useRef([]);

  const callPending = () => {};

  const callFunc = async (e) => {
    e.stopPropagation();
    setFunctionInputs(inputsRef.current);
    const funcInputs = [];

    functionInputs.map((item, i) => {
      funcInputs.push(functionInputs[i].value);
    });
    try {
      let res;
      if (contractFuncObj.isRead) {
        res = await contract.functions[contractFuncObj.name](
          ...Object.values(functionInputs)
        );
        setFunctionResponse(res);
      } else {
        setPending(true);
        res = await writeFunction(
          contract,
          contractFuncObj.name,
          funcInputs
        ).then((res) => {
          setPending(false);
          setFunctionResponse(res.hash);
          if (toggled) {
            const traceRes = getInternalTxns(res.hash, network).then(
              (traceRes) => {
                setTraceRes(traceRes);
              }
            );
          }
        });
      }
    } catch (err) {
      setErrRes(String(err.message));
      setPending(false);
    }
  };

  const load = async () => {
    const dRes = await getSingleFunctionDescrip(
      contractFuncObj.contractAddy,
      contractFuncObj.id
    );
    setDescription(dRes);
    setFunctionResponse("");
  };

  useEffect(() => {
    load();
    inputsRef.current = inputsRef.current.slice(
      0,
      contractFuncObj.inputs.length
    );
  }, [contract, contractFuncObj.inputs]);

  const openEditView = (e) => {
    setSelectedFunc(contractFuncObj);
    console.log(contractFuncObj);
  };

  const showFuncHandler = () => {
    if (showFunctionInputs) {
      setShowFunctionInputs(false);
    } else {
      setShowFunctionInputs(true);
    }
  };

  const inputChangeHandler = () => {
    setFunctionInputs(inputsRef.current);
  };

  return (
    <div
      className={`contract-function-div ${
        showFunctionInputs ? "function-box" : "function-box"
      }`}
      onClick={showFuncHandler}
    >
      {/* function sigantaure */}
      <StarButton contractFuncObj={contractFuncObj} />

      <div className={`left-align function-container`}>
        <code className="func-signature">
          <div>
            <span className="bold">{contractFuncObj.name}</span> →{" "}
            {contractFuncObj.parseOutputsJSX(contractFuncObj.outputs)}
          </div>
        </code>
        <div
          className="description"
          style={{ color: "grey", margin: "4px 0px 12px 0px" }}
        >
          {description ? `${description}` : "No description found"}
        </div>

        {/* function inputs for read/write */}
        <div className={`left-align ${showFunctionInputs ? `show` : "hide"} `}>
          {contractFuncObj.inputs ? (
            <form>
              {contractFuncObj.inputs.map((obj, i) => (
                <div className="inner-form" key={i}>
                  <div className="write-form">
                    <code style={{ fontSize: "14px" }}>
                      ({obj.type}) {obj.name}
                    </code>
                  </div>
                  <input
                    className="func-input"
                    onChange={inputChangeHandler}
                    ref={(el) => (inputsRef.current[i] = el)}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  ></input>
                </div>
              ))}
            </form>
          ) : null}
          {txPending ? (
            <span style={{ color: "rgb(255, 179, 0)" }}>
              Transaction pending...
            </span>
          ) : null}
          {errRes ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "0px",
                  marginTop: "25px",
                }}
              >
                <span
                  className="tab"
                  style={{ fontStyle: "italic", marginTop: "auto" }}
                >
                  Error
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFunctionResponse("");
                    setErrRes(null);
                  }}
                  id="clear-return"
                  style={{ marginLeft: "6px" }}
                >
                  Clear
                </button>
              </div>
              <textarea
                readOnly={true}
                className="returnedInput"
                value={String(errRes)}
                style={{ textAlign: "left", fontStyle: "italic" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></textarea>
            </>
          ) : null}
          {functionResponse !== "" ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "0px",
                  marginTop: "25px",
                }}
              >
                <span
                  className="tab"
                  style={{ fontStyle: "italic", marginTop: "auto" }}
                >
                  Transaction hash
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFunctionResponse("");
                  }}
                  id="clear-return"
                  style={{ marginLeft: "6px" }}
                >
                  Clear
                </button>
              </div>
              <div
                className="trace-ui-div"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {String(functionResponse)}
              </div>
              {traceRes ? (
                <>
                  {traceRes.map((resItem, i) => {
                    return (
                      <div key={i}>
                        <RiArrowDownSLine style={{ color: "#7300ff" }} />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: "0px",
                            marginTop: "5px",
                          }}
                        >
                          <span
                            className="tab"
                            style={{ fontStyle: "italic", marginTop: "auto" }}
                          >
                            {`Trace: ${i + 1}`}
                          </span>
                        </div>
                        <div
                          className="trace-ui-div"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <span className="trace-ui-attributes">{`from: ${resItem.action.from}`}</span>
                          <span className="trace-ui-attributes">{`to: ${resItem.action.to}`}</span>
                          <span className="trace-ui-attributes">{`type: ${resItem.type}`}</span>
                          <span className="trace-ui-attributes">{`value: ${resItem.value}`}</span>
                          <span className="trace-ui-attributes">{`output: ${resItem.result.output}`}</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : null}
            </>
          ) : null}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: "10px",
              flexDirection: "row",
              marginTop: "8px",
            }}
          >
            <Link to={`edit/${contractFuncObj.id}`}>
              <button
                style={{ float: "left" }}
                id="suggest-read-button"
                onClick={openEditView}
              >
                Suggest
              </button>
            </Link>
            <button
              onClick={callFunc}
              id="suggest-read-button"
              style={{ paddingLeft: "43px", paddingRight: "43px" }}
            >
              {contractFuncObj.isRead ? "Read" : "Write"}
            </button>
            {contractFuncObj.isRead ? null : (
                <TraceSwitch toggled={toggled} setToggled={setToggled} />
              )}
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", width: "80px" }}>
          <span className="tiny-text tag">
            {contractFuncObj.isRead ? `Read 📖` : `Write 📝`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContractFunction;
