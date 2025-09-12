// import React, { useState, useEffect } from "react";
// import "../../assets/css/index.css";

// export const HomePage = () => {
//   const [documents, setDocuments] = useState([]);
//   const [stats, setStats] = useState({ total: 0, expired: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [formData, setFormData] = useState({
//     documentType: "",
//     vehicleType: "",
//     vehicleNumber: "",
//     issueDate: "",
//     expirationDate: ""
//   });

//   const token = localStorage.getItem("jwtToken");

//   useEffect(() => {
//     if (token) {
//       fetchDocuments();
//       fetchStats();
//     }
//   }, [token]);

//   const fetchDocuments = async () => {
//     try {
//       const response = await fetch("http://localhost:3200/docs/puc", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setDocuments(data);
//       } else {
//         setError("Failed to fetch documents");
//       }
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//       setError("Failed to fetch documents");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await fetch("http://localhost:3200/docs/stats", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setStats({
//           total: data.totalDocuments || 0,
//           expired: data.expieredDocs || 0
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:3200/docs/puc", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         setFormData({
//           documentType: "",
//           vehicleType: "",
//           vehicleNumber: "",
//           issueDate: "",
//           expirationDate: ""
//         });
//         fetchDocuments();
//         fetchStats();
//       } else {
//         setError("Failed to add document");
//       }
//     } catch (error) {
//       console.error("Error adding document:", error);
//       setError("Failed to add document");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:3200/docs/puc/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         fetchDocuments();
//         fetchStats();
//       } else {
//         setError("Failed to delete document");
//       }
//     } catch (error) {
//       console.error("Error deleting document:", error);
//       setError("Failed to delete document");
//     }
//   };

//   const filteredDocuments = documents.filter(doc =>
//     doc.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     doc.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     doc.documentType?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const expiringDocuments = documents.filter(doc => {
//     const expirationDate = new Date(doc.expirationDate);
//     const today = new Date();
//     const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));
//     return daysUntilExpiration <= 15 && daysUntilExpiration > 0;
//   });

//   return (
//     <div style={{
//       height: "100vh",
//       backgroundColor: "#f4f4f4",
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden"
//     }}>
//       <div id="titlebar" style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         height: "32px",
//         background: "#f0f0f0",
//         display: "flex",
//         justifyContent: "flex-end",
//         alignItems: "center",
//         zIndex: 9999
//       }}>
//         <div id="window-controls" style={{ display: "flex" }}>
//           <button id="minimize" style={{
//             width: "46px",
//             height: "32px",
//             background: "transparent",
//             border: "none",
//             color: "#333",
//             fontSize: "10px",
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//           }}>
//             <i className="material-icons">remove</i>
//           </button>
//           <button id="maximize" style={{
//             width: "46px",
//             height: "32px",
//             background: "transparent",
//             border: "none",
//             color: "#333",
//             fontSize: "10px",
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//           }}>
//             <i className="material-icons">crop_square</i>
//           </button>
//           <button id="close" style={{
//             width: "46px",
//             height: "32px",
//             background: "transparent",
//             border: "none",
//             color: "#333",
//             fontSize: "10px",
//             cursor: "pointer",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//           }}>
//             <i className="material-icons">close</i>
//           </button>
//         </div>
//       </div>

//       <header style={{
//         backgroundColor: "#2c3e50",
//         color: "#ecf0f1",
//         padding: "1rem",
//         marginTop: "32px",
//         flexShrink: 0
//       }}>
//         <div className="header-content" style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center"
//         }}>
//           <img
//             src="../assets/icons/android-chrome-512x512.png"
//             alt="DocAlert Logo"
//             className="logo"
//             style={{ height: "50px", marginRight: "15px" }}
//           />
//           <h1>DocAlert</h1>
//         </div>
//       </header>

//       <main style={{
//         flex: 1,
//         padding: "2rem",
//         paddingBottom: "5rem",
//         overflowY: "auto",
//         minHeight: 0
//       }}>
//         {error && (
//           <div style={{
//             color: "red",
//             marginBottom: "1rem",
//             textAlign: "center",
//             padding: "0.5rem",
//             backgroundColor: "#fee",
//             borderRadius: "4px",
//             border: "1px solid #fcc"
//           }}>
//             {error}
//           </div>
//         )}

//         <section className="dashboard">
//           <h2>Document Dashboard</h2>
//           <div className="dashboard-stats" style={{
//             display: "flex",
//             justifyContent: "space-around",
//             marginBottom: "2rem"
//           }}>
//             <div className="stat-card" style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "1rem",
//               textAlign: "center",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               flex: 1,
//               margin: "0 1rem"
//             }}>
//               <i className="fas fa-file-alt" style={{ fontSize: "2rem", color: "#3498db" }}></i>
//               <span id="totalDocuments" style={{
//                 display: "block",
//                 fontSize: "1.5rem",
//                 fontWeight: "bold",
//                 margin: "0.5rem 0"
//               }}>{stats.total || 0}</span>
//               <p>Total Documents</p>
//             </div>
//             <div className="stat-card" style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "1rem",
//               textAlign: "center",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               flex: 1,
//               margin: "0 1rem"
//             }}>
//               <i className="fas fa-exclamation-triangle" style={{ fontSize: "2rem", color: "#e74c3c" }}></i>
//               <span id="expired" style={{
//                 display: "block",
//                 fontSize: "1.5rem",
//                 fontWeight: "bold",
//                 margin: "0.5rem 0"
//               }}>{stats.expired || 0}</span>
//               <p>Expired</p>
//             </div>
//           </div>

//           {expiringDocuments.length > 0 && (
//             <div className="expiring-documents" style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               padding: "1rem",
//               marginBottom: "2rem",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
//             }}>
//               <h3 style={{ marginBottom: "1rem" }}>
//                 <i className="fas fa-exclamation-circle" style={{ color: "#f39c12" }}></i> Documents Expiring Soon
//               </h3>
//               <div className="expiring-list-container" style={{ maxHeight: "200px", overflowY: "auto" }}>
//                 <div className="expiring-list">
//                   {expiringDocuments.map((doc) => (
//                     <div key={doc.id} className="expiring-item" style={{
//                       backgroundColor: "#fff3cd",
//                       border: "1px solid #ffeaa7",
//                       borderRadius: "4px",
//                       padding: "0.5rem",
//                       marginBottom: "0.5rem"
//                     }}>
//                       <h4 style={{ margin: "0 0 0.25rem 0" }}>{doc.documentType}</h4>
//                       <p style={{ margin: "0", fontSize: "0.9rem" }}>
//                         {doc.vehicleNumber} - {doc.vehicleType} - Expires: {new Date(doc.expirationDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </section>

//         <section className="document-list">
//           <h2>Uploaded Documents</h2>
//           <div className="search-container" style={{
//             display: "flex",
//             marginBottom: "1rem",
//             gap: "0.5rem"
//           }}>
//             <input
//               type="text"
//               id="searchInput"
//               placeholder="Search by vehicle number, type or document type..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 flex: 1,
//                 padding: "0.5rem",
//                 border: "1px solid #ddd",
//                 borderRadius: "4px"
//               }}
//             />
//             <button id="searchBtn" style={{
//               padding: "0.5rem 1rem",
//               backgroundColor: "#3498db",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer"
//             }}>
//               <span className="material-icons">search</span>
//             </button>
//           </div>

//           {loading ? (
//             <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
//           ) : (
//             <div className="table-container" style={{
//               backgroundColor: "#fff",
//               borderRadius: "8px",
//               overflow: "hidden",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//               marginBottom: "2rem"
//             }}>
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr style={{ backgroundColor: "#f8f9fa" }}>
//                     <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>Document Type</th>
//                     <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>Vehicle Type</th>
//                     <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>Vehicle Number</th>
//                     <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>Issue Date</th>
//                     <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>Expiration Date</th>
//                     <th style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody id="documentTable">
//                   {filteredDocuments.map((doc) => (
//                     <tr key={doc.id}>
//                       <td style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{doc.documentType}</td>
//                       <td style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{doc.vehicleType}</td>
//                       <td style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{doc.vehicleNumber}</td>
//                       <td style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{new Date(doc.issueDate).toLocaleDateString()}</td>
//                       <td style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>{new Date(doc.expirationDate).toLocaleDateString()}</td>
//                       <td style={{ padding: "1rem", textAlign: "left", borderBottom: "1px solid #e0e0e0" }}>
//                         <button
//                           onClick={() => handleDelete(doc.id)}
//                           style={{
//                             backgroundColor: "#e74c3c",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "4px",
//                             padding: "0.25rem 0.5rem",
//                             cursor: "pointer"
//                           }}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         <section className="upload-form" style={{
//           backgroundColor: "#fff",
//           borderRadius: "8px",
//           padding: "2rem",
//           boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
//         }}>
//           <h2>Upload New Document</h2>
//           <form id="documentForm" onSubmit={handleSubmit}>
//             <div className="form-group" style={{ marginBottom: "1rem" }}>
//               <label htmlFor="documentType" style={{ display: "block", marginBottom: "0.5rem" }}>Document Type</label>
//               <input
//                 type="text"
//                 id="documentType"
//                 required
//                 placeholder="e.g., PUC, RC, Insurance"
//                 value={formData.documentType}
//                 onChange={(e) => setFormData({...formData, documentType: e.target.value})}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px"
//                 }}
//               />
//             </div>
//             <div className="form-group" style={{ marginBottom: "1rem" }}>
//               <label htmlFor="vehicleType" style={{ display: "block", marginBottom: "0.5rem" }}>Vehicle Type</label>
//               <input
//                 type="text"
//                 id="vehicleType"
//                 required
//                 value={formData.vehicleType}
//                 onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px"
//                 }}
//               />
//             </div>
//             <div className="form-group" style={{ marginBottom: "1rem" }}>
//               <label htmlFor="vehicleNumber" style={{ display: "block", marginBottom: "0.5rem" }}>Vehicle Number</label>
//               <input
//                 type="text"
//                 id="vehicleNumber"
//                 required
//                 placeholder="Enter vehicle number"
//                 value={formData.vehicleNumber}
//                 onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px"
//                 }}
//               />
//             </div>
//             <div className="form-group" style={{ marginBottom: "1rem" }}>
//               <label htmlFor="issueDate" style={{ display: "block", marginBottom: "0.5rem" }}>Issue Date</label>
//               <input
//                 type="date"
//                 id="issueDate"
//                 required
//                 value={formData.issueDate}
//                 onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px"
//                 }}
//               />
//             </div>
//             <div className="form-group" style={{ marginBottom: "1rem" }}>
//               <label htmlFor="expirationDate" style={{ display: "block", marginBottom: "0.5rem" }}>Expiration Date</label>
//               <input
//                 type="date"
//                 id="expirationDate"
//                 required
//                 value={formData.expirationDate}
//                 onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
//                 style={{
//                   width: "100%",
//                   padding: "0.5rem",
//                   border: "1px solid #ddd",
//                   borderRadius: "4px"
//                 }}
//               />
//             </div>
//             <button type="submit" className="btn-primary" style={{
//               backgroundColor: "#3498db",
//               color: "white",
//               border: "none",
//               borderRadius: "4px",
//               padding: "0.75rem 1.5rem",
//               cursor: "pointer",
//               fontSize: "1rem"
//             }}>
//               Upload Document
//             </button>
//           </form>
//         </section>
//       </main>

//       <footer style={{
//         backgroundColor: "#2c3e50",
//         color: "#ecf0f1",
//         textAlign: "center",
//         padding: "1rem",
//         marginTop: "auto"
//       }}>
//         <p>&copy; 2023 Vehicle Document Manager. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

























// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
// } from '@tanstack/react-table';
// import { useMemo } from 'react';
// import React from 'react';

// export function HomePage() {
//   const [getDocument, { isLoading }] = useGetDocumentsMutation();

//   const fetchDocuments = async () => {
//     try {
//       const result = await getDocument().unwrap();
//       console.log('Documents', result);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <table className='table-auto border-collapse border border-gray-300 w-full'>
//       <thead>
//         {table.getHeaderGroups().map((headerGroup) => (
//           <tr key={headerGroup.id}>
//             {headerGroup.headers.map((header) => (
//               <th key={header.id} className='border p-2 bg-gray-100'>
//                 {flexRender(
//                   header.column.columnDef.header,
//                   header.getContext()
//                 )}
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody>
//         {table.getRowModel().rows.map((row) => (
//           <tr key={row.id}>
//             {row.getVisibleCells().map((cell) => (
//               <td key={cell.id} className='border p-2'>
//                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
