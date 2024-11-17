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


console.log(`Window load`);
window.onload = async () => {
  logger.log("log", "loading documents")
  await fetchDocuments();
  await updateDashboardStats();
};

const apiHandler = new APIHandler();
const uiHandler = new UIHandler();

async function fetchDocuments(): Promise<void> {
  const documents = await apiHandler.fetchDocuments();
  uiHandler.updateDocumentTable(documents);
  uiHandler.updateExpiringDocList(documents);
}

async function updateDashboardStats(): Promise<void> {
  const stats = await apiHandler.fetchDashboardStats();
  if (stats) {
    document.getElementById("totalDocuments").textContent =
      stats.totalDocuments;
    document.getElementById("expiringDocuments").textContent =
      stats.expiringDocuments;
  } else {
    console.error("Failed to fetch dashboard stats");
  }
}
