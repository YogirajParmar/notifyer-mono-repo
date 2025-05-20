document.querySelector(".email-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  
  try {
    const response = await fetch(`http://localhost:3200/auth/reset-password`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
      });
  
    if (!response.ok) {
      alert("Please verify you email");
      return;
    };
  
    window.location.href = "login.html";
  } catch (error) {
    console.log(error);
  }
});