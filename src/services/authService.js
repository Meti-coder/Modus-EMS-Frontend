// src/services/authService.js

const API_BASE = "http://localhost:8080/api/users";

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function register(user, roleName) {
  const response = await fetch(`${API_BASE}/register/${roleName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const text = await response.json();
  let data;
  try {
   // data = JSON.parse(text);
  } catch (err) {
   // data = { message: text };
  }

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}
