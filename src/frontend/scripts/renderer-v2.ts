import { logger } from "@backend/helpers";
import APIHandler from "./apis";
import UIHandler from "./ui";

interface VDocument {
  documentType: string;
  vehicleType: string;
  vehicleNumber: string;
  issueDate: string;
  expirationDate: string;
}

export default class Renderer extends UIHandler {
  constructor() {
    super();
    this.fetchDocuments();
  }
 }

window.onload = async () => {
  logger.log("log", "loading documents");
  try {
    new Renderer();
  } catch (error) {
    console.error("Error during window load:", error);
  }
};

console.log(`Window load`);

const apiHandler = new APIHandler();
const uiHandler = new UIHandler();
console.log({ apiHandler, uiHandler });
async function fetchDocuments(): Promise<void> {
  try {
    const documents = await apiHandler.fetchDocuments();
    uiHandler.updateDocumentTable(documents);
    uiHandler.updateExpiringDocList(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

async function updateDashboardStats(): Promise<void> {
  try {
    const stats = await apiHandler.fetchDashboardStats();
    if (stats) {
      document.getElementById("totalDocuments").textContent =
        stats.totalDocuments;
      document.getElementById("expiringDocuments").textContent =
        stats.expiringDocuments;
    } else {
      console.error("Failed to fetch dashboard stats");
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
}
