import React, { useEffect, useState } from "react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/users/")
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  function handleDelete(id) {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    }).then(() => setUsers(users.filter((u) => u.id !== id)));
  }

  function handleEditSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:5000/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    })
      .then((r) => r.json())
      .then((updated) => {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditUser(null);
      });
  }

  return (
    <div className="container">
      <h2>All Users</h2>
      {users.map((u) => (
        <div key={u.id} style={{ border: "1px solid gray", padding: 10, marginBottom: 10 }}>
          <p><strong>Username:</strong> {u.username}</p>
          <p><strong>Email:</strong> {u.email}</p>
          <button onClick={() => setEditUser(u)}>Edit</button>
          <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 5 }}>Delete</button>
        </div>
      ))}

      {editUser && (
        <form onSubmit={handleEditSubmit}>
          <h3>Edit User</h3>
          <input
            type="text"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            placeholder="Username"
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="password"
            onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
            placeholder="New Password (optional)"
          />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}

export default UsersList;
