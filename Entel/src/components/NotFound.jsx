import background from "../images/Error-search.png";

const NotFound = ({}) => {
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "18pt",
        color: "white",
        backgroundColor: "#1a003a",
        backgroundImage: `url(${background})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 style={{marginTop: "150px"}}>404 - Not Found!</h1>
      We couldn't find what you're looking for...😢
    </div>
  );
};

export default NotFound;
