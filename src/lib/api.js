const API_BASE_URL = "http://127.0.0.1:8010";

export async function createEvent(eventData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create event");
  }

  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events/`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch events");
  }

  return response.json();
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to register user");
  }

  return response.json();
}

export async function loginUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to log in");
  }

  return response.json();
}

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users/`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch users");
  }

  return response.json();
}

export async function addFriend(friendEmail) {
  const response = await fetch(`${API_BASE_URL}/friends/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: friendEmail }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to add friend");
  }

  return response.json();
}