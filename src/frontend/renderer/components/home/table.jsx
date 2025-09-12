import React, { useState } from 'react';

export const TableWithPagination = ({ data, rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className='p-6'>
      <div className='overflow-x-auto rounded-2xl shadow-md border border-gray-200 bg-white'>
        <table className='w-full border-collapse'>
          <thead className='bg-gradient-to-r from-indigo-50 to-indigo-100'>
            <tr>
              <th className='p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                Vehicle No.
              </th>
              <th className='p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                Vehicle Type
              </th>
              <th className='p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                Issue Date
              </th>
              <th className='p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                Expiry Date
              </th>
              <th className='p-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200'>
                Document Type
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((doc, index) => (
              <tr
                key={index}
                className='hover:bg-indigo-50 transition-colors duration-200'
              >
                <td className='p-4 text-sm text-gray-800 border-b border-gray-200'>
                  {doc.vehicleNumber}
                </td>
                <td className='p-4 text-sm text-gray-800 border-b border-gray-200'>
                  {doc.vehicleType}
                </td>
                <td className='p-4 text-sm text-gray-800 border-b border-gray-200'>
                  {formatDate(doc.issueDate)}
                </td>
                <td className='p-4 text-sm text-gray-800 border-b border-gray-200'>
                  {formatDate(doc.expirationDate)}
                </td>
                <td className='p-4 text-sm text-gray-800 border-b border-gray-200'>
                  {doc.documentType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}

      <div className='flex justify-end mt-4'>
        <div className='flex space-x-2'>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          ${
            currentPage === i + 1
              ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold'
              : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  const newDate = new Date(date);

  return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
};
