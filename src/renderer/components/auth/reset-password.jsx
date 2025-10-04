import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await fetch(
        'http://localhost:3200/auth/reset-password',
        {
          method: 'PUT',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.ok) {
        toast.success('Password reset successful.');
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Password reset failed.');
      }
    } catch (err) {
      console.log(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-white font-sans'>
      {/* Top right login link */}
      <div className='fixed top-4 right-4 z-10'>
        <p className='text-sm text-gray-500'>
          Back to{' '}
          <Link to='/' className='text-black font-medium hover:underline'>
            login page
          </Link>
        </p>
      </div>

      <div className='w-full max-w-[500px] p-5 text-center'>
        <div className='w-[60px] h-[60px] bg-[#dcdcdc] rounded-full mx-auto mb-5'></div>

        <div className='border border-[#e0e0e0] rounded-xl p-6'>
          <h2 className='text-[22px] mb-6'>Reset Password</h2>

          <form onSubmit={handleSubmit}>
            <input
              type='email'
              className='w-4/5 p-3 mb-5 border border-[#ccc] rounded-md text-sm placeholder-gray-400 placeholder-opacity-100'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className='relative w-4/5 mx-auto'>
              <input
                type='password'
                id='password'
                className='w-full p-3 mb-5 border border-[#ccc] rounded-md text-sm placeholder-gray-400 placeholder-opacity-100'
                placeholder='New password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className='text-red-500'>{error}</div>}
            {message && <div className='text-green-600'>{message}</div>}

            <button
              className='w-4/5 py-3.5 bg-black text-white rounded-full text-base mt-[30px] cursor-pointer hover:bg-gray-800'
              type='submit'
            >
              Reset Password
            </button>
          </form>
        </div>

        <div className='text-center mt-8 text-xs text-gray-500'>
          <span>© 2023 Vehicle Document Manager. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};
