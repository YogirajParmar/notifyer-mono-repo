import React from 'react';

import { useState } from 'react';

export const UploadForm = ({ handleFormSubmit }) => {
  const [formData, setFormData] = useState({
    documentType: '',
    vehicleNumber: '',
    vehicleType: '',
    issueDate: '',
    expirationDate: '',
  });

  const initialFormData = {
    documentType: '',
    vehicleNumber: '',
    vehicleType: '',
    issueDate: '',
    expirationDate: '',
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return (
    <div>
      <form className='w-full mx-auto'>
        {/* upload type */}
        <div className='px-7'>
          <div className='mb-5'>
            <label
              htmlFor='upload-type'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Enter document type
            </label>
            <input
              type='text'
              id='upload-type'
              className='shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light'
              placeholder='e.g., puc, rc, Insurance'
              required
              value={formData.documentType}
              onChange={(e) => {
                setFormData({ ...formData, documentType: e.target.value });
              }}
            />
          </div>

          {/* vehicle type */}
          <div className='mb-5'>
            <label
              htmlFor='vehicle-type'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Enter vehicle type
            </label>
            <input
              type='text'
              id='vehicle-type'
              className='shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light'
              placeholder='e.g., car, bike, truck'
              required
              value={formData.vehicleType}
              onChange={(e) => {
                setFormData({ ...formData, vehicleType: e.target.value });
              }}
            />
          </div>

          {/* vehicle number */}
          <div className='mb-5'>
            <label
              htmlFor='vehicle-number'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Enter vehicle plate numer
            </label>
            <input
              type='text'
              id='vehicle-type'
              className='shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light'
              pattern='[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}'
              required
              value={formData.vehicleNumber}
              onChange={(e) => {
                setFormData({ ...formData, vehicleNumber: e.target.value });
              }}
            />
          </div>

          {/* issue date */}
          <div className='mb-5'>
            <label
              htmlFor='issue-date'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Enter document issue date
            </label>
            <input
              type='date'
              id='issue-date'
              className='shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light'
              required
              value={formData.issueDate}
              onChange={(e) => {
                setFormData({ ...formData, issueDate: e.target.value });
              }}
            />
          </div>

          {/* expiration date */}
          <div className='mb-5'>
            <label
              htmlFor='expiration-date'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Enter document expiration date
            </label>
            <input
              type='date'
              id='expiration-date'
              className='shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light'
              required
              value={formData.expirationDate}
              onChange={(e) => {
                setFormData({ ...formData, expirationDate: e.target.value });
              }}
            />
          </div>

          {/* submit button */}
          <div className='mb-5'>
            <button
              type='button'
              onClick={() => handleFormSubmit(formData, resetForm)}
              className='inline-flex items-center px-3 py-2 text-sm font-small text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150'
              disabled={Object.values(formData).some((value) => value == '')}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
