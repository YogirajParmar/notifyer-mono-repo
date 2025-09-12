import React, { useState, useEffect } from 'react';

import { useGetDocumentsQuery } from '../../redux/api/documents/documentApiSlice';
import { TableWithPagination } from './table';

export function HomePage() {
  const { data = [], isLoading, isError } = useGetDocumentsQuery();

  return (
    <div className='p-4 bg-gray-50 min-h-screen font-sans flex flex-col items-center'>
      <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800 text-center'>
          Vehicle Documents
        </h1>

        {isLoading && (
          <div className='text-center py-4 text-blue-600'>
            <p>Loading documents...</p>
          </div>
        )}

        {isError && (
          <div className='text-center py-4 text-red-600'>
            <p>Error fetching documents. Please try again.</p>
          </div>
        )}

        {!isLoading && data.length > 0 && (
          <TableWithPagination data={data}></TableWithPagination>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <p>No documents found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
