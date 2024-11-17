// import { VDocument } from "@backend/types";
interface VDocument {
  documentType: string;
  vehicleType: string;
  vehicleNumber: string;
  issueDate: string;
  expirationDate: string;
}

const token = localStorage.getItem("jwtToken");

export default class APIHandler {
  constructor() {}

  public fetchDocuments = async (): Promise<VDocument[]> => {
    if (!token) {
      alert("Authorization token missing! Please log in.");
      window.location.href = "login.html";
      return [];
    }

    try {
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
        return [];
      }

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return [];
      }

      const documents = (await response.json()) as VDocument[];

      return documents;
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      alert(
        "An error occurred while fetching documents. Please try again later."
      );
      return [];
    }
  };

  public deleteDocument = async (id: string) => {
    const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to delete document");
    }
    return { success: true };
  };

  public createDocument = async (documentData: VDocument): Promise<void> => {
    const response = await fetch("http://localhost:3200/docs/puc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      console.error("Failed to upload document", await response.text()); // Log the response text for debugging
    }
  };

  public getDocument = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const document = (await response.json()) as VDocument;
      return document;
    } catch (error) {
      console.log("Error fetching document for update", error);
      alert("Failed to fetch document.");
    }
  };

  public updateDocument = async (id: string, documentData: VDocument) => {
    const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      console.error("Failed to update document");
    }
    return { success: true };
  };

  public fetchDashboardStats = async (): Promise<any> => {
    const response = await fetch("http://localhost:3200/docs/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch dashboard stats");
      return null;
    }
    return await response.json();
  };
}
