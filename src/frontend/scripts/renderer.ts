// Fetch the JWT token from local storage
const token = localStorage.getItem("jwtToken");

interface VDocument {
  id?: string;
  documentType: string;
  vehicleType: string;
  vehicleNumber: string;
  issueDate: string;
  expirationDate: string;
}

// Fetch and display existing documents when the app loads
window.onload = () => {
  fetchDocuments();
  updateDashboardStats();
};

async function fetchDocuments(): Promise<void> {
  const response = await fetch("http://localhost:3200/docs/puc", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    alert("Unauthorized! Please log in again.");
    window.location.href = "login.html";
    return;
  }

  const documentList: VDocument[] = await response.json();

  const documentTable = document.getElementById("documentTable") as HTMLTableElement;
  documentTable.innerHTML = ""; // Clear the table before adding new rows

  documentList.forEach((doc) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${doc.documentType}</td>
      <td>${doc.vehicleType}</td>
      <td>${doc.vehicleNumber}</td>
      <td>${new Date(doc.issueDate).toLocaleDateString()}</td>
      <td>${new Date(doc.expirationDate).toLocaleDateString()}</td>
      <td>
        <button class="btn-edit" data-id="${doc.id}">Edit</button>
        <button class="btn-delete" data-id="${doc.id}">Delete</button>
      </td>
    `;
    documentTable.appendChild(row);
  });

  // Add event listeners for edit and delete buttons
  addTableButtonListeners();
}

function addTableButtonListeners() {
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = (e.target as HTMLButtonElement).getAttribute('data-id');
      // Implement edit functionality
      console.log(`Edit document with id: ${id}`);
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = (e.target as HTMLButtonElement).getAttribute('data-id');
      deleteDocument(id);
    });
  });
}

async function deleteDocument(id: string) {
  const response = await fetch(`http://localhost:3200/docs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    fetchDocuments();
    updateDashboardStats();
  } else {
    console.error("Failed to delete document");
  }
}

async function updateDashboardStats(): Promise<void> {
  const response = await fetch("http://localhost:3200/docs/puc", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const stats = await response.json();
    document.getElementById("totalDocuments").textContent = stats.totalDocuments;
    document.getElementById("expiringDocuments").textContent = stats.expiringDocuments;
  } else {
    console.error("Failed to fetch dashboard stats");
  }
}

// Handle form submission to upload new document details
const documentForm = document.getElementById("documentForm") as HTMLFormElement;
documentForm.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const documentType = (document.getElementById("documentType") as HTMLInputElement).value;
  const vehicleType = (document.getElementById("vehicleType") as HTMLSelectElement).value;
  const vehicleNumber = (document.getElementById("vehicleNumber") as HTMLInputElement).value;
  const issueDate = (document.getElementById("issueDate") as HTMLInputElement).value;
  const expirationDate = (document.getElementById("expirationDate") as HTMLInputElement).value;

  const documentData: VDocument = {
    documentType,
    vehicleType,
    vehicleNumber,
    issueDate,
    expirationDate,
  };

  const response = await fetch("http://localhost:3200/docs/puc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(documentData),
  });

  if (response.ok) {
    fetchDocuments();
    updateDashboardStats();
    documentForm.reset();
  } else if (response.status === 401) {
    alert("Unauthorized! Please log in again.");
    window.location.href = "login.html";
  } else {
    console.error("Failed to upload document");
  }
});
