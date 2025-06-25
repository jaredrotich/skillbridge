import React, { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    is_admin: false,
  });

  useEffect(() => {
    fetch("http://localhost:5000/users/", {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => setUsers((prev) => prev.filter((u) => u.id !== id)));
  }

  function handleEditSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:5000/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(editUser),
    })
      .then((r) => r.json())
      .then((updated) => {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditUser(null);
      });
  }

  function toggleAdmin(user) {
    fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ is_admin: !user.is_admin }),
    })
      .then((r) => r.json())
      .then((updated) =>
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      );
  }

  function handleNewUserSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newUser),
    })
      .then((r) => r.json())
      .then((created) => {
        if (!created.error) {
          setUsers((prev) => [...prev, created]);
          setNewUser({ username: "", email: "", password: "", is_admin: false });
        } else {
          alert(created.error);
        }
      });
  }

  return (
    <div className="container">
      <h2>All Users</h2>

      {/* --- CREATE NEW USER FORM --- */}
      <form onSubmit={handleNewUserSubmit} style={{ marginBottom: "2rem" }}>
        <h3>Create New User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <label>
          Admin?{" "}
          <input
            type="checkbox"
            checked={newUser.is_admin}
            onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
          />
        </label>
        <button type="submit">Create User</button>
      </form>

      {/* --- LIST ALL USERS --- */}
      {users.map((u) => (
        <div
          key={u.id}
          style={{
            border: "1px solid gray",
            padding: 10,
            marginBottom: 10,
            backgroundColor: u.is_admin ? "#f0f8ff" : "#fff",
          }}
        >
          <p>
            <strong>Username:</strong> {u.username}{" "}
            {u.is_admin && <span style={{ color: "green" }}>👑 Admin</span>}
          </p>
          <p><strong>Email:</strong> {u.email}</p>

          <button onClick={() => setEditUser(u)}>Edit</button>
          <button
            onClick={() => handleDelete(u.id)}
            style={{ marginLeft: 5, color: "red" }}
          >
            Delete
          </button>
          <button
            onClick={() => toggleAdmin(u)}
            style={{ marginLeft: 5 }}
          >
            {u.is_admin ? "Remove Admin" : "Make Admin"}
          </button>
        </div>
      ))}

      {/* --- EDIT FORM --- */}
      {editUser && (
        <form onSubmit={handleEditSubmit} style={{ marginTop: "2rem" }}>
          <h3>Edit User</h3>
          <input
            type="text"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            placeholder="Username"
            required
          />
          <br />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            placeholder="Email"
            required
          />
          <br />
          <input
            type="password"
            onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
            placeholder="New Password (optional)"
          />
          <br />
          <button type="submit">Save</button>
          <button
            type="button"
            onClick={() => setEditUser(null)}
            style={{ marginLeft: 10 }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default UsersList;
