console.log("✅ JavaScript loaded correctly!");

class MimirGames {
  constructor() {
    this.backendBaseUrl = window.location.origin;
    this.init();
  }

  init() {
    this.checkDevMode();
    this.checkLoginStatus();
    this.setupEventListeners();
  }

  checkDevMode() {
    const devMode = localStorage.getItem("mimirDevMode") === "true";
    if (devMode) {
      localStorage.setItem("mimirUsername", "Putte68");
      localStorage.setItem("mimirIsLoggedIn", "true");
      console.log(
        "%c🧪 Dev mode enabled. Logged in as Putte68!",
        "color: lime; font-weight: bold",
      );

      const banner = document.getElementById("devBanner");
      if (banner) banner.style.display = "block";
    }
    
    // Check admin status and show admin links
    this.checkAdminStatus();
  }

  checkAdminStatus() {
    // Test mode: Admin link is always visible
    // Remove this method later when implementing proper admin authentication
    console.log("%c🛡️ Test mode: Admin link always visible", "color: #00ffcc; font-weight: bold");
  }

  checkLoginStatus() {
    const loggedIn = localStorage.getItem("mimirIsLoggedIn") === "true";
    const username = localStorage.getItem("mimirUsername");

    if (loggedIn && username && username.length >= 6) {
      this.showMainContent(username);
    } else {
      this.showUsernameModal();
    }
  }

  showUsernameModal() {
    const modal = document.getElementById("usernameModal");
    const mainContent = document.getElementById("mainContent");

    if (modal) modal.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";
  }

  showMainContent(username) {
    const modal = document.getElementById("usernameModal");
    const mainContent = document.getElementById("mainContent");
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (modal) modal.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${username}!`;
  }

  setupEventListeners() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const emailInput = document.getElementById("emailInput");
    const errorDiv = document.getElementById("authError");
    const successDiv = document.getElementById("authSuccess");

    if (loginBtn) {
      loginBtn.addEventListener("click", () => this.handleAuth("login"));
    }

    if (registerBtn) {
      registerBtn.addEventListener("click", () => this.handleAuth("register"));
    }

    [usernameInput, passwordInput, emailInput].forEach((input) => {
      if (input) {
        input.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            this.handleAuth("login");
          }
        });
        
        // Clear error messages when user starts typing
        input.addEventListener("input", () => {
          const errorDiv = document.getElementById("authError");
          const successDiv = document.getElementById("authSuccess");
          if (errorDiv) errorDiv.textContent = "";
          if (successDiv) successDiv.textContent = "";
          // Don't clear the email notification - let it persist
        });
      }
    });

    const logoutBtn = document.getElementById("logoutBtn");
    const logoutLink = document.getElementById("logoutLink");

    [logoutBtn, logoutLink].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.logout();
        });
      }
    });

    const connectWalletBtn = document.getElementById("connectWalletBtn");
    if (connectWalletBtn) {
      connectWalletBtn.addEventListener("click", () => {
        alert("Wallet connection coming soon!");
      });
    }
  }

  async handleAuth(action) {
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const emailInput = document.getElementById("emailInput");
    const errorDiv = document.getElementById("authError");
    const successDiv = document.getElementById("authSuccess");

    const username = usernameInput?.value.trim();
    const password = passwordInput?.value;
    const email = emailInput?.value.trim();

    if (errorDiv) errorDiv.textContent = "";
    if (successDiv) successDiv.textContent = "";

    const validation = this.validateCredentials(username, password);
    if (!validation.valid) {
      if (errorDiv) errorDiv.textContent = validation.error;
      return;
    }

    try {
      const response = await fetch(
        `${this.backendBaseUrl}/api/auth/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        if (action === "register") {
          // Show success toast after registration
          this.showToast("Account created and you're now logged in!", "info", 8000);
        } else if (successDiv) {
          if (action === "login" && data.emailAdded) {
            // Show persistent email notification
            this.showEmailAddedNotification();
          } else {
            successDiv.textContent = data.message;
          }
        }
        localStorage.setItem("mimirUsername", username);
        localStorage.setItem("mimirIsLoggedIn", "true");
        setTimeout(() => this.showMainContent(username), 1000);
      } else {
        if (errorDiv) {
          if (action === "login" && (response.status === 401 || data.error.includes("användarnamn") || data.error.includes("lösenord"))) {
            errorDiv.innerHTML = '<strong>Incorrect username or password.</strong><br><em>Check your information. To create a new account with these details, click Register.</em>';
          } else {
            errorDiv.textContent = data.error;
          }
        }
      }
    } catch (error) {
      if (errorDiv)
        errorDiv.textContent = "Connection error. Please try again.";
      console.error("Auth error:", error);
    }
  }

  validateCredentials(username, password) {
    if (!username) return { valid: false, error: "Please enter a username" };
    if (username.length < 6)
      return { valid: false, error: "Username must be at least 6 characters" };
    if (username.length > 20)
      return { valid: false, error: "Username must be 20 characters or less" };
    if (!password) return { valid: false, error: "Please enter a password" };
    if (password.length < 8)
      return { valid: false, error: "Password must be at least 8 characters" };

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      return {
        valid: false,
        error: "Password must contain uppercase, lowercase, number, and symbol",
      };
    }

    return { valid: true };
  }

  showToast(message, type = "info", duration = 5000) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Base toast styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.3s ease-out;
      cursor: pointer;
    `;
    
    // Type-specific styling
    if (type === "success") {
      toast.style.background = "rgba(34, 197, 94, 0.9)";
      toast.style.color = "white";
      toast.style.border = "1px solid #22c55e";
    } else if (type === "error") {
      toast.style.background = "rgba(239, 68, 68, 0.9)";
      toast.style.color = "white";
      toast.style.border = "1px solid #ef4444";
    } else {
      toast.style.background = "rgba(0, 255, 204, 0.15)";
      toast.style.color = "#00ffcc";
      toast.style.border = "1px solid #00ffcc";
    }
    
    // Add animation styles if not present
    if (!document.getElementById('toastStyles')) {
      const styles = document.createElement('style');
      styles.id = 'toastStyles';
      styles.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    // Remove any existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, duration);
    
    // Remove on click
    toast.addEventListener("click", () => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    });
  }

  showEmailAddedNotification() {
    this.showToast("Email address added to your profile. You can now reset your password if needed.", "info", 8000);
  }

  logout() {
    localStorage.removeItem("mimirIsLoggedIn");
    localStorage.removeItem("mimirUsername");
    this.showUsernameModal();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MimirGames();
});
