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

export async function deleteEvent(eventId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("failed to delete event");
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
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/users/`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch users");
  }

  return response.json();
}

export async function addFriend(friendEmail) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}/friends/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email: friendEmail }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to add friend");
  }

  return response.json();
}

export async function getPendingFriendRequests() {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}/friends/requests`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch friend requests");
  }

  return response.json();
}

export async function acceptFriendRequest(requestId) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}/friends/requests/${requestId}/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to accept friend request");
  }

  return response.json();
}

export async function declineFriendRequest(requestId) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_BASE_URL}/friends/requests/${requestId}/decline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to decline friend request");
  }

  return response.json();
}

export async function getUser(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch user");
  }
  return response.json();
}

export async function getUserEvents(userId) {
  const response = await fetch(`${API_BASE_URL}/events/?creator_user_id=${userId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch user events");
  }
  return response.json();
}

export async function getFriends(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/friends`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch friends");
  }
  return response.json();
}