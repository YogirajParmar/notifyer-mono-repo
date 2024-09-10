// Define the type for the expected response
interface AuthResponse {
  token: string;
}

// Get the form and attach a submit event listener
const signupForm = document.getElementById("signupForm") as HTMLFormElement;
signupForm.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  // Get form values
  const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
  const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    // Make a POST request to the sign-up endpoint
    const response = await fetch("http://localhost:3200/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (response.ok) {
      // Parse the response as JSON and cast it to the AuthResponse interface
      const data: AuthResponse = await response.json();
      const token = data.token;

      // Store the token in local storage
      localStorage.setItem("jwtToken", token);

      // Redirect to the main app page
      window.location.href = "index.html";
    } else {
      alert("Sign up failed");
    }
  } catch (error) {
    console.error("Error during signup", error);
  }
});
