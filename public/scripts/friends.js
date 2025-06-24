
const API_URL = "";  // Use relative URLs since we're on the same server

async function addFriend(username) {
  try {
    const currentUser = localStorage.getItem('mimirUsername');
    if (!currentUser) {
      throw new Error("Please log in first");
    }

    const res = await fetch(`${API_URL}/api/friends`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-current-user": currentUser
      },
      body: JSON.stringify({ username }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error adding friend:", err);
    throw err;
  }
}

async function getFriends() {
  try {
    const currentUser = localStorage.getItem('mimirUsername');
    if (!currentUser) {
      return { friends: [] };
    }

    const res = await fetch(`${API_URL}/api/friends`, {
      headers: {
        "x-current-user": currentUser
      }
    });
    if (!res.ok) throw new Error("Could not fetch friends list");
    return await res.json();
  } catch (err) {
    console.error("Error fetching friends:", err);
    return { friends: [] };
  }
}

async function removeFriend(friendUsername) {
  try {
    const currentUser = localStorage.getItem('mimirUsername');
    if (!currentUser) {
      throw new Error("Please log in first");
    }

    const res = await fetch(`${API_URL}/api/friends/${friendUsername}`, {
      method: "DELETE",
      headers: {
        "x-current-user": currentUser
      }
    });
    if (!res.ok) throw new Error("Could not remove friend");
    return await res.json();
  } catch (err) {
    console.error("Error removing friend:", err);
    throw err;
  }
}
