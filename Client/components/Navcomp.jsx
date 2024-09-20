function Navcomp() {
  const handleRegisterClick = () => {
    window.location.href = "./register";
  };

  return (
    <>
      <nav id="navb">
        <ul>
          <li>
            <button onClick={handleRegisterClick}>Home</button>
          </li>
          <li>
            <button>About</button>
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
