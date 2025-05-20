// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>DocAlert</title>
//     <link
//       rel="stylesheet"
//       href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
//     />
//     <link rel="stylesheet" href="../assets/css/index.css" />
//     <link rel="stylesheet" href="../assets/css/window-controls.css" />
//     <link
//       rel="stylesheet"
//       href="https://fonts.googleapis.com/icon?family=Material+Icons"
//     />
//   </head>
//   <body>
//     <div id="titlebar">
//       <div id="window-controls">
//         <button id="minimize"><i className="material-icons">remove</i></button>
//         <button id="maximize"><i className="material-icons">crop_square</i></button>
//         <button id="close"><i className="material-icons">close</i></button>
//       </div>
//     </div>

//     <header>
//       <div className="header-content">
//         <img
//           src="../assets/icons/android-chrome-512x512.png"
//           alt="DocAlart Logo"
//           className="logo"
//         />
//         <h1>DocAlert</h1>
//       </div>
//     </header>

//     <main>
//       <section className="dashboard">
//         <h2>Document Dashboard</h2>
//         <div className="dashboard-stats">
//           <div className="stat-card">
//             <i className="fas fa-file-alt"></i>
//             <span id="totalDocuments">0</span>
//             <p>Total Documents</p>
//           </div>
//           <div className="stat-card">
//             <i className="fas fa-exclamation-triangle"></i>
//             <span id="expired">0</span>
//             <p>Expierd</p>
//           </div>
//         </div>

//         <!-- New section htmlFor expiring documents -->
//         <div className="expiring-documents">
//           <h3>
//             <i className="fas fa-exclamation-circle"></i> Documents Expiring Soon
//           </h3>
//           <div className="expiring-list-container">
//             <div id="expiringList" className="expiring-list">
//               <!-- Expiring documents will be inserted here dynamically -->
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="document-list">
//         <h2>Uploaded Documents</h2>
//         <div className="search-container">
//           <input
//             type="text"
//             id="searchInput"
//             placeholder="Search by vehicle number, type or document type..."
//           />
//           <button id="searchBtn">
//             <span className="material-icons">search</span>
//           </button>
//         </div>
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th>Document Type</th>
//                 <th>Vehicle Type</th>
//                 <th>Vehicle Number</th>
//                 <th>Issue Date</th>
//                 <th>Expiration Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody id="documentTable">
//               <!-- Fetched document details will be inserted here -->
//             </tbody>
//           </table>
//         </div>
//         <div className="reset">
//           <button type="reset" id="reset-table-btn" style="display: none">
//             Reset
//           </button>
//         </div>
//       </section>

//       <section className="upload-form">
//         <h2>Upload New Document</h2>
//         <form id="documentForm">
//           <div className="form-group">
//             <label htmlFor="documentType">Document Type</label>
//             <input
//               type="text"
//               id="documentType"
//               required
//               placeholder="e.g., PUC, RC, Insurance"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="vehicleType">Vehicle Type</label>
//             <input type="text" id="vehicleType" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="vehicleNumber">Vehicle Number</label>
//             <input
//               type="text"
//               id="vehicleNumber"
//               required
//               placeholder="Enter vehicle number"
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="issueDate">Issue Date</label>
//             <input type="date" id="issueDate" required />
//           </div>
//           <div className="form-group">
//             <label htmlFor="expirationDate">Expiration Date</label>
//             <input type="date" id="expirationDate" required />
//           </div>
//           <button type="submit" className="btn-primary">Upload Document</button>
//         </form>
//       </section>
//     </main>

//     <footer>
//       <p>&copy; 2023 Vehicle Document Manager. All rights reserved.</p>
//     </footer>

//     <script type="module" src="../scripts/renderer.js"></script>
//   </body>
//   </html>

import React from "react";
import "../assets/css/index.css";

export const HomePage = () => {
  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <div id="titlebar">
        <div id="window-controls">
          <button id="minimize">
            <i className="material-icons">remove</i>
          </button>
          <button id="maximize">
            <i className="material-icons">crop_square</i>
          </button>
          <button id="close">
            <i className="material-icons">close</i>
          </button>
        </div>
      </div>

      <header>
        <div className="header-content">
          <img
            src="../assets/icons/android-chrome-512x512.png"
            alt="DocAlart Logo"
            className="logo"
          />
          <h1>DocAlert</h1>
        </div>
      </header>

      <main>
        <section className="dashboard">
          <h2>Document Dashboard</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <i className="fas fa-file-alt"></i>
              <span id="totalDocuments">0</span>
              <p>Total Documents</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-exclamation-triangle"></i>
              <span id="expired">0</span>
              <p>Expierd</p>
            </div>
          </div>

          {/* <!-- New section htmlFor expiring documents --> */}
          <div className="expiring-documents">
            <h3>
              <i className="fas fa-exclamation-circle"></i> Documents Expiring
              Soon
            </h3>
            <div className="expiring-list-container">
              <div id="expiringList" className="expiring-list">
                {/* <!-- Expiring documents will be inserted here dynamically --> */}
              </div>
            </div>
          </div>
        </section>

        <section className="document-list">
          <h2>Uploaded Documents</h2>
          <div className="search-container">
            <input
              type="text"
              id="searchInput"
              placeholder="Search by vehicle number, type or document type..."
            />
            <button id="searchBtn">
              <span className="material-icons">search</span>
            </button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Vehicle Type</th>
                  <th>Vehicle Number</th>
                  <th>Issue Date</th>
                  <th>Expiration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="documentTable">
                {/* <!-- Fetched document details will be inserted here --> */}
              </tbody>
            </table>
          </div>
          <div className="reset">
            <button
              type="reset"
              id="reset-table-btn"
              style={{ display: "none" }}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="upload-form">
          <h2>Upload New Document</h2>
          <form id="documentForm">
            <div className="form-group">
              <label htmlFor="documentType">Document Type</label>
              <input
                type="text"
                id="documentType"
                required
                placeholder="e.g., PUC, RC, Insurance"
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type</label>
              <input type="text" id="vehicleType" required />
            </div>
            <div className="form-group">
              <label htmlFor="vehicleNumber">Vehicle Number</label>
              <input
                type="text"
                id="vehicleNumber"
                required
                placeholder="Enter vehicle number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="issueDate">Issue Date</label>
              <input type="date" id="issueDate" required />
            </div>
            <div className="form-group">
              <label htmlFor="expirationDate">Expiration Date</label>
              <input type="date" id="expirationDate" required />
            </div>
            <button type="submit" className="btn-primary">
              Upload Document
            </button>
          </form>
        </section>
      </main>

      <footer>
        <p>&copy; 2023 Vehicle Document Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};
