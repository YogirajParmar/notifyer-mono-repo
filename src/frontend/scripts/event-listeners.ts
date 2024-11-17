import APIHandler from "./apis";
import UIHandler from "./ui";

export default class EventListeners {
  private apiHandler: APIHandler;
  private uiHandler: UIHandler;

  constructor() {
    this.apiHandler = new APIHandler();
    this.uiHandler = new UIHandler();
  }

    public addTableButtonListeners() {
        const editButtons = document.querySelectorAll('.btn-edit');
        const deleteButtons = document.querySelectorAll('.btn-delete');

        editButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id = (event.target as HTMLButtonElement).getAttribute("data-id");
                this.openEditModal(id);
            });
        });

        deleteButtons.forEach(button => {
            button.addEventListener("click", event => {
                const id = (event.target as HTMLButtonElement).getAttribute("data-id");
                this.deleteDocument(id);
            })
        })
    };

  public openEditModal = async (id: string) => {
    const document = await this.apiHandler.getDocument(id);
    if (document) {
      await this.uiHandler.showEditForm(document);
      };
  };

  public handleEditSubmit = async (event: Event) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const id = (document.getElementById("editId") as HTMLInputElement).value;
    const documentType = (
      document.getElementById("editDocumentType") as HTMLInputElement
    ).value;
    const vehicleType = (
      document.getElementById("editVehicleType") as HTMLSelectElement
    ).value;
    const vehicleNumber = (
      document.getElementById("editVehicleNumber") as HTMLInputElement
    ).value;
    const issueDate = (
      document.getElementById("editIssueDate") as HTMLInputElement
    ).value;
    const expirationDate = (
      document.getElementById("editExpirationDate") as HTMLInputElement
    ).value;

    const payload = {
      documentType,
      vehicleType,
      vehicleNumber,
      issueDate,
      expirationDate,
    };
    try {
      const response = await this.apiHandler.updateDocument(id, payload);
      if (!response.success) {
        throw new Error("Failed to update document");
      }
      alert("Document updated successfully");
      this.closeModel();
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update document");
    }
  };

  public closeModel = () => {
    const modal = document.querySelector(".modal");
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  };

  public deleteDocument = async (id: string) => {
    const response = await this.apiHandler.deleteDocument(id);

    if (response.success) {
      // refresh document table
      const docs = await this.apiHandler.fetchDocuments();
      this.uiHandler.updateDocumentTable(docs);
    }
  };
}
