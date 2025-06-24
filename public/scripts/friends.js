
const API_URL = "";  // Use relative URLs since we're on the same server

async function addFriend(username) {
  try {
    const res = await fetch(`${API_URL}/api/friends`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${API_URL}/api/friends`);
    if (!res.ok) throw new Error("Could not fetch friends list");
    return await res.json();
  } catch (err) {
    console.error("Error fetching friends:", err);
    return { friends: [] };
  }
}

async function removeFriend(friendUsername) {
  try {
    const res = await fetch(`${API_URL}/api/friends/${friendUsername}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Could not remove friend");
    return await res.json();
  } catch (err) {
    console.error("Error removing friend:", err);
    throw err;
  }
}
