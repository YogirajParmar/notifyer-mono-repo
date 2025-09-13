import React, { useState, useEffect } from 'react';

import {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
} from '../../redux/api/documents/documentApiSlice';
import { TableWithPagination } from './table';
import { UploadForm } from './upload-form';
import toast from 'react-hot-toast';

export function HomePage() {
  const { data = [], isLoading, isError } = useGetDocumentsQuery();

  const [createDocument] = useCreateDocumentMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (document, resetForm) => {
    try {
      await createDocument(document).unwrap();

      resetForm();
      setIsOpen(false);
      toast.success('Document uploaded!');
    } catch (error) {
      console.error('Error uploading document: %s', error);
      toast.error('Failed to upload document');
    }
  };

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

        {!isLoading && !isError && (
          <TableWithPagination data={data}></TableWithPagination>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all z-50'
      >
        <span className='text-3xl font-bold'>+</span>
      </button>

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-lg font-semibold'>Upload Document</h2>
          <button
            onClick={() => setIsOpen(false)}
            className='text-gray-600 hover:text-gray-900'
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className='p-4 overflow-y-auto h-full'>
          <UploadForm handleFormSubmit={handleSubmit} />
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className='fixed inset-0 z-30'
        ></div>
      )}
    </div>
  );
}
