const { ipcRenderer } = require("electron");

interface AuthResponse {
  token: string;
}

const form = document.querySelector(".login-form") as HTMLFormElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorMessage = document.getElementById("error-message") as HTMLDivElement;

const minimizeButton = document.getElementById("minimize");
const maximizeButton = document.getElementById("maximize");
const closeButton = document.getElementById("close");

const windowButtons = [minimizeButton, maximizeButton, closeButton];

windowButtons.forEach((button) => {
  if (button) {
    button.addEventListener("click", () => {
      console.log("Button", button.id);
      ipcRenderer.send(`${button.id}-window`);
    });
  }
});

const params = new URLSearchParams(window.location.search);
if (params.get("error") === "1") {
  errorMessage.textContent = "Login failed. Please check your credentials.";
  errorMessage.style.display = "block";
}

const showError = (message: string) => {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  } else {
    console.warn("Error message element not found");
  }
};

const resetForm = () => {
  emailInput.value = "";
  passwordInput.value = "";
  emailInput.focus();
};

console.log("login script loaded");

form?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  errorMessage.style.display = "none";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch("http://localhost:3200/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      ipcRenderer.send("login-failed");
      return;
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem("jwtToken", data.token);
    ipcRenderer.send("login-success");
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred. Please try again.");
    resetForm();
  }
});
