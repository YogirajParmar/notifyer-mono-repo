interface AuthResponse {
  token: string;
}

document.querySelector('.signup-form')?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const firstName = (document.getElementById("firstname") as HTMLInputElement).value;
  const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    const response = await fetch("http://localhost:3200/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (response.ok) {
      const data: AuthResponse = await response.json();
      const token = data.token;

      localStorage.setItem("jwtToken", token);

      window.location.href = "index.html";
    } else {
      alert("Sign up failed");
    }
  } catch (error) {
    console.error("Error during signup", error);
  }
});