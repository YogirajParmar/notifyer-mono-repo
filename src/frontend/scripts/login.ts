// import { logger } from "@backend/helpers";
const { ipcRenderer } = require("electron");
interface AuthResponse {
  token: string;
}

document
  .querySelector(".login-form")
  ?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("http://localhost:3200/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // logger.log(
      //   "info",
      //   `Sign-in API response  \n response: ${response}  \n status: ${response.status}`
      // );

      if (!response.ok) {
        alert("Login failed. Please check your credentials.");
        emailInput.value = "";
        passwordInput.value = "";
        emailInput.focus();
        return;
      }

      const data: AuthResponse = await response.json();

      localStorage.setItem("jwtToken", data.token);

      if (localStorage.getItem("jwtToken") !== null) {
        ipcRenderer.send("login-success");
      }

      // window.location.href = "index.html";
    } catch (error) {
      console.error("Error during login", error);
    }
  });
