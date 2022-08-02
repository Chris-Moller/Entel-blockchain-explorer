import LoaderIcon from "./LoaderIcon.jsx";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#1a003a",
        fontSize: "30pt",
        color: "white",
      }}
    >
      Ξ
      <LoaderIcon style={{ margin: "auto" }} />
    </div>
  );
};

export default Loader;
