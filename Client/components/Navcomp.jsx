function Navcomp() {
  const handleRegisterClick = () => {
    window.location.href = "./register";
  };
  const handleRegisterClickl = () => {
    window.location.href = "./login";
  };
  const handleRegisterClickh = () => {
    window.location.href = "./";
  };
  const handleRegisterClicka = () => {
    window.location.href = "./about";
  };

  return (
    <>
      <nav id="navb">
        <ul>
          <li>
            <button onClick={handleRegisterClickh}>Home</button>
          </li>
          <li>
            <button onClick={handleRegisterClicka}>About</button>
          </li>
          <li>
            <button onClick={handleRegisterClickl}>Login</button>
          </li>
          <li>
            <button onClick={handleRegisterClick}>Register</button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navcomp;
