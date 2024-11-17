interface AuthResponse {
  token: string;
}

// Get the form and attach a submit event listener
document.querySelector(".login-form")?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  // Get email and password values
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    // Make a POST request to the sign-in endpoint
    const response = await fetch("http://localhost:3200/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Parse the response as JSON and cast it to the AuthResponse interface
      const data: AuthResponse = await response.json();

      // Store the token in local storage
      localStorage.setItem("jwtToken", data.token);

      // Redirect to the main app page
      window.location.href = "index.html";
    } else {
      alert("Login failed");
    }
  } catch (error) {
    console.error("Error during login", error);
  }
});