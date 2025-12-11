// src/pages/AdminUsers.tsx
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, UserPlus } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const json = await res.json();
      setUsers(json);
    } catch (e) {
      console.error(e);
      // fallback to mock so UI doesn't break
      setUsers([
        { id: "1", name: "Alice Student", email: "alice@example.com", role: "student" },
        { id: "2", name: "Bob Faculty", email: "bob@example.com", role: "faculty" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setUsers((s) => s.filter((u) => u.id !== id));
    } catch (e) {
      alert("Could not delete user. See console.");
      console.error(e);
    }
  };

  const handleCreate = async () => {
    const name = prompt("Name of new user:");
    const email = prompt("Email:");
    const role = prompt("Role (student | faculty | admin):", "student") as User["role"];
    if (!name || !email || !role) return;
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setUsers((s) => [created, ...s]);
    } catch (e) {
      alert("Could not create user. Check console.");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" userName="Admin" />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <div className="flex gap-2">
            <Button onClick={handleCreate}><UserPlus className="w-4 h-4 mr-2" /> Add user</Button>
            <Button variant="ghost" onClick={fetchUsers}>Refresh</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Name</th>
                  <th className="p2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
