
// Global logout functionality for all pages
function logout() {
  localStorage.removeItem('mimirIsLoggedIn');
  localStorage.removeItem('mimirUsername');
  localStorage.removeItem('mimirDevMode'); // Also clear dev mode if set
  window.location.href = 'index.html';
}

// Initialize logout buttons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Handle all logout buttons (both topbar and page-specific)
  document.querySelectorAll('[onclick="logout()"], #logoutBtn, #logoutLink').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  });
});
