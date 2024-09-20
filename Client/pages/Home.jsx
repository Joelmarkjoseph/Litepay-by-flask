import Navcomp from "../components/Navcomp";

function Home() {
  const tstyl = {
    color: "white",
    "font-size": "100px",
  };
  return (
    <>
      <Navcomp />
      <h1 id="title" style={tstyl} align="center">
        Welcome to LITEPAY
      </h1>
    </>
  );
}

export default Home;
