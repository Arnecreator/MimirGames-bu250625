const API_URL =
  "https://5b64a943-af57-4396-befe-b9b5d36d484f-00-2akqxpp85lu04.spock.replit.dev";

async function loadLeaderboard(game) {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard/${game}`);
    if (!res.ok) throw new Error("Kunde inte hämta topplistan");
    const data = await res.json();

    const list = document.getElementById("leaderboard");
    list.innerHTML = "";

    data.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.username}: ${entry.score} poäng`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    document.getElementById("leaderboard").innerHTML =
      "<li>Fel vid hämtning av data.</li>";
  }
}
// public/scripts/leaderboard.js

async function loadLeaderboardData() {
  try {
    // Fetch all users from the backend
    const res = await fetch("/api/users");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const users = await res.json();
    
    // Transform user data to match leaderboard format
    const transformedUsers = users.map(user => ({
      username: user.username,
      qpd: user.quizPlayedDays || user.gamesPlayed || 0,
      nansw: user.quizAnswers || (user.gamesPlayed * 8) || 0,
      ncansw: user.quizCorrect || user.correctAnswers || 0,
      pcansw: user.quizPercentCorrect || (user.correctAnswers && user.gamesPlayed ? Math.round((user.correctAnswers / (user.gamesPlayed * 8)) * 100) : 0),
      nallc: user.quizFullScoreGames || user.fullScores || 0,
      pallc: user.quizPlayedDays ? Math.round((user.quizFullScoreGames || 0) / user.quizPlayedDays * 100) : 0,
      flame: user.quizStreak || user.bestStreak || 0,
      reg: formatRegDate(user.createdAt)
    }));
    
    // Sort users by %cansw descending, then by #cansw descending as tiebreaker
    transformedUsers.sort((a, b) => {
      if (b.pcansw !== a.pcansw) {
        return b.pcansw - a.pcansw;
      }
      return b.ncansw - a.ncansw;
    });
    
    // Get current username
    const currentUser = localStorage.getItem('mimirUsername') || '';
    
    // Clear existing table data
    const tableBody = document.getElementById('leaderboard-body');
    if (!tableBody) {
      console.error('Leaderboard table body not found');
      return;
    }
    tableBody.innerHTML = '';
    
    // Find current user's rank
    let currentUserRank = -1;
    transformedUsers.forEach((user, index) => {
      if (user.username === currentUser) {
        currentUserRank = index + 1;
      }
    });
    
    // Update "Your Rank" display
    const yourRankElement = document.getElementById('yourRank');
    if (yourRankElement && currentUserRank > 0) {
      yourRankElement.textContent = `Your Rank: #${currentUserRank} out of ${transformedUsers.length}`;
    } else if (yourRankElement) {
      yourRankElement.textContent = `Your Rank: Not ranked (play a quiz to get ranked!)`;
    }
    
    // Store original users data for search functionality
    window.originalUsers = transformedUsers;
    
    // Render the table and add sorting functionality
    renderTable(transformedUsers);
    addSortingEventListeners(transformedUsers);
    addSearchFunctionality();
    
    console.log(`✅ Loaded ${transformedUsers.length} users in leaderboard`);
    
  } catch (error) {
    console.error('Error loading leaderboard data:', error);
    
    // Show error message in table
    const tableBody = document.getElementById('leaderboard-body');
    if (tableBody) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 20px; color: #ff6b6b;">
            Failed to load leaderboard data. Please try again later.
          </td>
        </tr>
      `;
    }
    
    // Update rank display
    const yourRankElement = document.getElementById('yourRank');
    if (yourRankElement) {
      yourRankElement.textContent = 'Your Rank: Unable to load data';
    }
  }
}

// Helper function to format registration date
function formatRegDate(createdAt) {
  try {
    if (!createdAt) return '------';
    const date = new Date(createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return year + month + day;
  } catch (e) {
    return '------';
  }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const currentUser = localStorage.getItem('mimirUsername');
  if (!currentUser) {
    window.location.href = 'index.html';
    return;
  }
  
  loadLeaderboardData();
});

// Function to sort table data
function sortTable(users, column, type, order) {
  return [...users].sort((a, b) => {
    let valA = a[column];
    let valB = b[column];
    
    if (type === "string") {
      return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return order === "asc" ? valA - valB : valB - valA;
    }
  });
}

// Function to restore sorting from localStorage
function restoreSorting(users) {
  const lastSortColumn = localStorage.getItem("lastSortColumn");
  const lastSortOrder = localStorage.getItem("lastSortOrder");
  
  if (lastSortColumn && lastSortOrder) {
    // Find the header and its type
    const header = document.querySelector(`[data-column="${lastSortColumn}"]`);
    if (header) {
      const type = header.dataset.type;
      header.dataset.order = lastSortOrder;
      
      // Update visual indicator
      document.querySelectorAll(".leaderboard-table th[data-column]").forEach(th => {
        // Reset all headers to show neutral sort indicator
        const originalText = th.textContent.replace(/\s*[↕️▲▼]\s*$/, '');
        th.textContent = originalText + ' ↕️';
      });
      
      // Set the active column's sort indicator
      const originalText = header.textContent.replace(/\s*[↕️▲▼]\s*$/, '');
      header.textContent = originalText + (lastSortOrder === 'asc' ? ' ▲' : ' ▼');
      
      // Sort and return the data
      return sortTable(users, lastSortColumn, type, lastSortOrder);
    }
  }
  
  return users;
}

// Function to render the leaderboard table
function renderTable(sortedUsers) {
  const currentUser = localStorage.getItem('mimirUsername') || '';
  const tableBody = document.getElementById('leaderboard-body');
  
  if (!tableBody) {
    console.error('Leaderboard table body not found');
    return;
  }
  
  // Restore sorting on first load if no sorted data provided
  if (!sortedUsers || sortedUsers === window.originalUsers) {
    sortedUsers = restoreSorting(window.originalUsers || sortedUsers);
  }
  
  tableBody.innerHTML = '';
  
  // Find current user's rank
  let currentUserRank = -1;
  sortedUsers.forEach((user, index) => {
    if (user.username === currentUser) {
      currentUserRank = index + 1;
    }
  });
  
  // Update "Your Rank" display
  const yourRankElement = document.getElementById('yourRank');
  if (yourRankElement && currentUserRank > 0) {
    yourRankElement.textContent = `Your Rank: #${currentUserRank} out of ${sortedUsers.length}`;
  } else if (yourRankElement) {
    yourRankElement.textContent = `Your Rank: Not ranked (play a quiz to get ranked!)`;
  }
  
  // Generate table rows
  sortedUsers.forEach((user, index) => {
    const row = document.createElement('tr');
    
    // Highlight top 10
    if (index < 10) {
      row.classList.add('top-10-row');
    }
    
    // Highlight current user's row
    if (user.username === currentUser) {
      row.classList.add('user-highlight');
      row.style.backgroundColor = '#004400';
    }
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td class="username-cell">${user.username}</td>
      <td class="stat-cell">${user.qpd}</td>
      <td class="stat-cell">${user.nansw}</td>
      <td class="stat-cell">${user.ncansw}</td>
      <td class="percent-cell">${user.pcansw}%</td>
      <td class="stat-cell">${user.nallc}</td>
      <td class="percent-cell">${user.pallc}%</td>
      <td class="stat-cell">${user.flame}</td>
      <td class="date-cell">${user.reg}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Function to add sorting event listeners to table headers
function addSortingEventListeners(users) {
  document.querySelectorAll(".leaderboard-table th[data-column]").forEach((header, index) => {
    header.style.cursor = 'pointer';
    header.addEventListener("click", () => {
      const column = header.dataset.column;
      const type = header.dataset.type;
      const order = header.dataset.order === "asc" ? "desc" : "asc";
      header.dataset.order = order;
      
      // Store sorting info in localStorage
      localStorage.setItem("lastSortColumn", column);
      localStorage.setItem("lastSortOrder", order);
      
      // Update visual indicator for sort direction
      document.querySelectorAll(".leaderboard-table th[data-column]").forEach(th => {
        // Reset all headers to show neutral sort indicator
        const originalText = th.textContent.replace(/\s*[↕️▲▼]\s*$/, '');
        th.textContent = originalText + ' ↕️';
      });
      
      // Set the active column's sort indicator
      const originalText = header.textContent.replace(/\s*[↕️▲▼]\s*$/, '');
      header.textContent = originalText + (order === 'asc' ? ' ▲' : ' ▼');

      // Get current filtered users from search
      const searchBox = document.getElementById('search-box');
      const searchTerm = searchBox ? searchBox.value.toLowerCase() : '';
      const currentUsers = searchTerm ? 
        window.originalUsers.filter(user => user.username.toLowerCase().includes(searchTerm)) : 
        window.originalUsers;

      // Sort the users array
      const sortedUsers = sortTable(currentUsers, column, type, order);

      // Re-render the table with sorted data
      renderTable(sortedUsers);
    });
  });
}

// Function to add search functionality
function addSearchFunctionality() {
  const searchBox = document.getElementById('search-box');
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredUsers = window.originalUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm)
      );
      
      // Apply current sorting to filtered results
      const lastSortColumn = localStorage.getItem("lastSortColumn");
      const lastSortOrder = localStorage.getItem("lastSortOrder");
      
      if (lastSortColumn && lastSortOrder) {
        const header = document.querySelector(`[data-column="${lastSortColumn}"]`);
        if (header) {
          const type = header.dataset.type;
          const sortedFilteredUsers = sortTable(filteredUsers, lastSortColumn, type, lastSortOrder);
          renderTable(sortedFilteredUsers);
          return;
        }
      }
      
      renderTable(filteredUsers);
    });
  }
}

// Refresh data when page becomes visible (user returns from other pages)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    loadLeaderboardData();
  }
});
