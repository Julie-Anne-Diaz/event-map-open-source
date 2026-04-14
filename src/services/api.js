const BASE_URL = "http://localhost:8000";

// Login — POST /auth/login
export async function loginUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return res.json(); // returns { access_token, token_type }
}

// Register — POST /auth/register
export async function registerUser(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Email already registered");
  return res.json();
}

// Get Events — GET /events
export async function fetchEvents() {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

// Create Event — POST /events
export async function createEvent(eventData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

export async function addFriend(friendEmail) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/friends/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ email: friendEmail }),
  });
  if (!res.ok) throw new Error("Failed to add friend");
  return res.json();
}
