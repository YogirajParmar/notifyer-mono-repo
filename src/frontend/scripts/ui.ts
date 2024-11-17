// import { VDocument } from "@backend/types";
import dayjs from "dayjs";
import EventListeners from "./event-listeners";
import APIHandler from "./apis";
interface VDocument {
  documentType: string;
  vehicleType: string;
  vehicleNumber: string;
  issueDate: string;
  expirationDate: string;
}

export default class UIHandler {
  private documentTable: HTMLTableElement;
  private eventListners: EventListeners;
  private apiHandler: APIHandler;

  constructor() {
    this.documentTable = document.getElementById(
      "documentTable"
    ) as HTMLTableElement;
    this.eventListners = new EventListeners();
    this.apiHandler = new APIHandler();
  }

  public fetchDocuments = async () => {
    try {
      const documents = await this.apiHandler.fetchDocuments();

      if (!documents) alert("No document found!");

      this.updateDocumentTable(documents);
      this.updateExpiringDocList(documents);
      this.eventListners.addTableButtonListeners();
    } catch (error) {}
  };

  public updateDocumentTable = (documents: any[]) => {
    this.documentTable.innerHTML = "";

    documents.forEach((doc) => {
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
      this.documentTable.appendChild(row);
    });
  };

  public updateExpiringDocList = (documents: VDocument[]) => {
    const expListEle = document.getElementById("expiringList");
    expListEle.innerHTML = "";

    const oneMonthFromNow = dayjs().add(1, "month").format("YYYY-MM-DD");

    const expiringDocs = documents.filter((doc) => {
      return (
        doc.expirationDate <= oneMonthFromNow &&
        doc.expirationDate > dayjs().format("YYYY-MM-DD")
      );
    });

    if (expiringDocs.length === 0) {
      expListEle.innerHTML = `<div class="Take a chill. No document expiring soon.</p></div>`;
    } else {
      expiringDocs.forEach((doc) => {
        const expiringIn = dayjs(doc.expirationDate).diff(dayjs(), "day");

        const item = document.createElement("div");
        item.className = "expiring-item";
        item.innerHTML = `
        <h4>${doc.documentType}</h4>
        <p><strong>Vehicle:</strong> ${doc.vehicleNumber}</p>
        <p><strong>Expires:</strong> ${new Date(doc.expirationDate).toLocaleDateString()}</p>
        <p><strong>Days left:</strong> ${expiringIn}</p>
        `;
        expListEle.appendChild(item);
      });
    }
  };

  public showEditForm = async (doc: any) => {
    const modal = document.createElement("div");

    modal.className = "modal";
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
            <option value="Car" ${doc.vehicleType === "Car" ? "selected" : ""}>Car</option>
            <option value="Bike" ${doc.vehicleType === "Bike" ? "selected" : ""}>Bike</option>
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

    document
      .getElementById("editForm")
      .addEventListener("submit", this.eventListners.handleEditSubmit);
    document
      .getElementById("cancelEdit")
      .addEventListener("click", this.eventListners.closeModel);
    modal
      .querySelector(".close")
      .addEventListener("click", this.eventListners.closeModel);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) this.eventListners.closeModel();
    });
  };
}
