import { useState, useEffect } from "react";

function Admin() {
  const [adminPassword, setAdminPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/users");
      const data = await response.json();
      setUsers(data.users); // Now each user should have a 'uid'
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (uid) => {
    if (!uid) {
      setErrorMessage("Invalid user UID");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/admin/delete_user/${uid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "admin-password": adminPassword,
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        alert(data.message);
        fetchUsers(); // Refresh user list after deletion
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorMessage("Failed to delete user");
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
      />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            {" "}
            {/* Use uid */}
            {user.first_name} - {user.contno} - Balance: {user.balance}
            <button onClick={() => deleteUser(user.uid)}>Delete</button>{" "}
            {/* Use uid */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
