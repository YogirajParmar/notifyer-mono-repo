// Fetch the JWT token from local storage
const token = localStorage.getItem("jwtToken");

// Define types for PUC data
interface PUC {
  vehicleType: string;
  vehicleNumber: string;
  issueDate: string;
  expirationDate: string;
}

// Fetch and display existing PUCs when the app loads
window.onload = () => {
  fetchPUCs();
};

async function fetchPUCs(): Promise<void> {
  const response = await fetch("http://localhost:3200/docs/puc", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include JWT token in the Authorization header
    },
  });

  if (response.status === 401) {
    alert("Unauthorized! Please log in again.");
    window.location.href = "login.html"; // Redirect to login page
    return;
  }

  const pucList: PUC[] = await response.json();

  const pucTable = document.getElementById("pucTable") as HTMLTableElement;
  pucTable.innerHTML = ""; // Clear the table before adding new rows

  pucList.forEach((puc) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${puc.vehicleType}</td>
      <td>${puc.vehicleNumber}</td>
      <td>${new Date(puc.issueDate).toLocaleDateString()}</td>
      <td>${new Date(puc.expirationDate).toLocaleDateString()}</td>
    `;
    pucTable.appendChild(row);
  });
}

// Handle form submission to upload new PUC details
const pucForm = document.getElementById("pucForm") as HTMLFormElement;
pucForm.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const vehicleType = (document.getElementById("vehicleType") as HTMLInputElement).value;
  const vehicleNumber = (document.getElementById("vehicleNumber") as HTMLInputElement).value;
  const issueDate = (document.getElementById("issueDate") as HTMLInputElement).value;
  const expirationDate = (document.getElementById("expirationDate") as HTMLInputElement).value;

  const pucData: PUC = {
    vehicleType,
    vehicleNumber,
    issueDate,
    expirationDate,
  };

  // Post the new PUC details to the backend with the JWT token
  const response = await fetch("http://localhost:3200/docs/puc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Include JWT token in the Authorization header
    },
    body: JSON.stringify(pucData),
  });

  if (response.ok) {
    // Refresh the PUC list after successful upload
    fetchPUCs();
  } else if (response.status === 401) {
    alert("Unauthorized! Please log in again.");
    window.location.href = "login.html"; // Redirect to login page
  } else {
    console.error("Failed to upload PUC");
  }
});
