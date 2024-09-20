import { useState } from "react";

function Form() {
  const [firstName, setFirstName] = useState("");
  const [contno, setContno] = useState("");
  const [bal, setBal] = useState("");
  const [pwd, setPwd] = useState("");

  const styl = {
    color: "white",
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      firstName,
      contno,
      bal,
      pwd,
    };

    const url = "http://127.0.0.1:5000/create_user";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const styl = {
      color: "white",
    };

    try {
      const response = await fetch(url, options);
      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        alert(data.message);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <>
      <form action="" method="post" style={styl} onSubmit={onSubmit}>
        <label htmlFor="name">Name: </label>
        <input
          style={styl}
          type="text"
          name="name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />
        <label htmlFor="phno">Contact No: </label>
        <input
          style={styl}
          type="text"
          name="contno"
          value={contno}
          onChange={(e) => setContno(e.target.value)}
        />
        <br />
        <label htmlFor="bal">Init Balance: </label>
        <input
          style={styl}
          type="text"
          name="bal"
          value={bal}
          onChange={(e) => setBal(e.target.value)}
        />
        <br />
        <label htmlFor="pwd">Password: </label>
        <input
          style={styl}
          type="password"
          name="pwd"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <br />
        <button type="submit" style={styl}>
          Register
        </button>
      </form>
    </>
  );
}

export default Form;
