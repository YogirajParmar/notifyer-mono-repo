const token = localStorage.getItem("jwtToken");

interface VDocument {
  id?: string;
  documentType: string;
  vehicleType: string;
  vehicleNumber: string;
  issueDate: string;
  expirationDate: string;
}

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
  documentTable.innerHTML = "";

  const currentDate = new Date();
  const warningDate = new Date();
  warningDate.setDate(currentDate.getDate() + 15);

  documentList.forEach((doc: any) => {
    const row = document.createElement("tr");

    const expirationDate = new Date(doc.expirationDate);
    if (expirationDate < currentDate) {
      row.style.backgroundColor = "rgba(227, 154, 154, 0.4)"; // Expired
    } else if (expirationDate < warningDate) {
      row.style.backgroundColor = "rgba(245, 234, 152, 0.4)"; // Expiring soon // 224, 216, 153
    } else {
      row.style.backgroundColor = "rgba(177, 222, 151, 0.4)"; // Valid
    }

    row.innerHTML = `
      <td>${doc.documentType}</td>
      <td>${doc.vehicleType}</td>
      <td>${doc.vehicleNumber}</td>
      <td>${new Date(doc.issueDate).toLocaleDateString()}</td>
      <td>${expirationDate.toLocaleDateString()}</td>
      <td>
        <button class="btn-edit" data-id="${doc.id}">Edit</button>
        <button class="btn-delete" data-id="${doc.id}">Delete</button>
      </td>
    `;
    documentTable.appendChild(row);
  });

  addTableButtonListeners();
  updateExpiringDocuments(documentList);
}


function addTableButtonListeners() {
  const editButtons = document.querySelectorAll('.btn-edit');
  const deleteButtons = document.querySelectorAll('.btn-delete');

  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = (e.target as HTMLButtonElement).getAttribute('data-id');
      openEditModal(id);
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const id = (e.target as HTMLButtonElement).getAttribute('data-id');
      deleteDocument(id);
    });
  });
}

async function openEditModal(id: string) {
  try {
    const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }

    const document = await response.json();

    showEditForm(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    alert('Failed to load document for editing');
  }
}

function showEditForm(doc: VDocument) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Edit Document</h2>
      <form id="editForm">
        <input type="hidden" id="editId" value="${doc.id}">
        <div class="form-group">
          <label for="editDocumentType">Document Type</label>
          <input type="text" id="editDocumentType" value="${doc.documentType}" required>
        </div>
        <div class="form-group">
          <label for="editVehicleType">Vehicle Type</label>
          <select id="editVehicleType" required>
            <option value="Car" ${doc.vehicleType === 'Car' ? 'selected' : ''}>Car</option>
            <option value="Bike" ${doc.vehicleType === 'Bike' ? 'selected' : ''}>Bike</option>
          </select>
        </div>
        <div class="form-group">
          <label for="editVehicleNumber">Vehicle Number</label>
          <input type="text" id="editVehicleNumber" value="${doc.vehicleNumber}" required>
        </div>
        <div class="form-group">
          <label for="editIssueDate">Issue Date</label>
          <input type="date" id="editIssueDate" value="${doc.issueDate}" required>
        </div>
        <div class="form-group">
          <label for="editExpirationDate">Expiration Date</label>
          <input type="date" id="editExpirationDate" value="${doc.expirationDate}" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Update</button>
          <button type="button" class="btn-secondary" id="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
  document.getElementById('cancelEdit').addEventListener('click', closeModal);
  modal.querySelector('.close').addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  function closeModal() {
    document.body.removeChild(modal);
  }
}

async function handleEditSubmit(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const id = (document.getElementById('editId') as HTMLInputElement).value;
  const documentType = (document.getElementById('editDocumentType') as HTMLInputElement).value;
  const vehicleType = (document.getElementById('editVehicleType') as HTMLSelectElement).value;
  const vehicleNumber = (document.getElementById('editVehicleNumber') as HTMLInputElement).value;
  const issueDate = (document.getElementById('editIssueDate') as HTMLInputElement).value;
  const expirationDate = (document.getElementById('editExpirationDate') as HTMLInputElement).value;

  try {
    const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documentType,
        vehicleType,
        vehicleNumber,
        issueDate,
        expirationDate
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }

    alert('Document updated successfully');
    closeModal();
    fetchDocuments(); // Refresh the document list
  } catch (error) {
    console.error('Error updating document:', error);
    alert('Failed to update document');
  }
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal && modal.parentNode) {
    modal.parentNode.removeChild(modal);
  }
}

async function deleteDocument(id: string) {
  const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
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
  const response = await fetch("http://localhost:3200/docs/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const stats = await response.json();
    document.getElementById("totalDocuments").textContent = stats.totalDocuments;
    document.getElementById("expiringDocuments").textContent = stats.expieredDocs;
  } else {
    console.error("Failed to fetch dashboard stats");
  }
}

// Handle form submission to upload new document details
const documentForm = document.getElementById("documentForm") as HTMLFormElement;
documentForm.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const documentType = (document.getElementById("documentType") as HTMLInputElement).value;
  const vehicleType = (document.getElementById("vehicleType") as HTMLInputElement).value;
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

  try {
    const response = await fetch("http://localhost:3200/docs/puc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(documentData),
    });

    const responseData = await response.json();

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
  } catch (error) {
    console.error("Error uploading document:", error);
  }
});

function updateExpiringDocuments(documents: VDocument[]) {
  const expiringList = document.getElementById('expiringList');
  expiringList.innerHTML = '';

  const fiftienDaysFromNow = new Date();
  fiftienDaysFromNow.setDate(fiftienDaysFromNow.getDate() + 15);

  const expiringDocs = documents.filter(doc => 
    new Date(doc.expirationDate) <= fiftienDaysFromNow && new Date(doc.expirationDate) > new Date()
  );

  if (expiringDocs.length === 0) {
    expiringList.innerHTML = '<div class="expiring-item"><p>No documents expiring soon.</p></div>';
  } else {
    expiringDocs.forEach(doc => {
      const daysUntilExpiry = Math.ceil((new Date(doc.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      const item = document.createElement('div');
      item.className = 'expiring-item';
      item.innerHTML = `
        <h4>${doc.documentType}</h4>
        <p><strong>Vehicle:</strong> ${doc.vehicleNumber}</p>
        <p><strong>Expires:</strong> ${new Date(doc.expirationDate).toLocaleDateString()}</p>
        <p><strong>Days left:</strong> ${daysUntilExpiry}</p>
      `;
      expiringList.appendChild(item);
    });
  }
}
