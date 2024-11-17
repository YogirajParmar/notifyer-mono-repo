interface AuthResponse {
  token: string;
}

document.querySelector(".login-form")?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    const response = await fetch("http://localhost:3200/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();

      localStorage.setItem("jwtToken", data.token);

      window.location.href = "index.html";
    } else {
      alert("Login failed");
    }
  } catch (error) {
    console.error("Error during login", error);
  }
});