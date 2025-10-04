import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../redux/api/auth/authApiSlice';

export const SignUp = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [signUp, { isLoading }] = useSignupMutation();

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(isLoading);

    try {
      const result = await signUp({
        email,
        password,
        firstName,
        lastName,
      }).unwrap();
      setLoading(isLoading);

      // save auth token
      localStorage.setItem('jwtToken', result.token);

      // navigate to home
      navigate('/home');
    } catch (error) {
      console.log('Error occured: ', error);
      setError(err.data.error);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-white font-sans text-gray-800 relative'>
      {/* Top right login link */}
      <div className='fixed top-4 right-4 z-10'>
        <p className='text-sm text-gray-500'>
          Already have an account?{' '}
          <Link to='/' className='text-black font-medium hover:underline'>
            login here
          </Link>
        </p>
      </div>

      <div className='w-full max-w-[500px] p-5 text-center'>
        {/* Logo placeholder */}
        <div className='w-[60px] h-[60px] bg-gray-300 rounded-full mx-auto mb-8'></div>
        {/* Signup card */}
        <div className='border border-[#e0e0e0] rounded-xl p-6'>
          <h1 className='text-[22px] font-semibold mb-6'>Create an account</h1>

          <form onSubmit={handleSignUp} className='space-y-4'>
            <div className='w-4/5 mx-auto'>
              <input
                id='first-name'
                name='first-name'
                type='text'
                required
                className='w-full p-3 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 placeholder-gray-400 placeholder-opacity-100'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='First Name'
              />
            </div>

            <div className='w-4/5 mx-auto'>
              <input
                type='text'
                required
                className='w-full p-3 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 placeholder-gray-400 placeholder-opacity-100'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Last Name'
              />
            </div>

            <div className='w-4/5 mx-auto'>
              <input
                type='email'
                required
                className='w-full p-3 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 placeholder-gray-400 placeholder-opacity-100'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='w-4/5 mx-auto'>
              <div className='relative'>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  required
                  className='w-full p-3 border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 placeholder-gray-400 placeholder-opacity-100'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600 cursor-pointer'
                  onClick={() => setPasswordVisible((v) => !v)}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </span>
              </div>

              {/* Password requirements */}
              <div className='mt-2 text-xs text-gray-600 space-y-1'>
                {[
                  'Use 8 or more characters',
                  'Use upper and lower case letters (e.g. Aa)',
                  'Use a number (e.g. 1234)',
                  'Use a symbol (e.g. !@#$)',
                ].map((requirement, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className='text-red-500 text-sm'>{error}</div>}

            <div className='w-4/5 mx-auto pt-6'>
              <button
                type='submit'
                className={`w-full py-4 bg-black text-white font-semibold rounded-full transition-colors hover:bg-gray-800 ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                }`}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>
        </div>
        {/* Privacy text - Optional */}
        <div className='text-center text-sm text-gray-500 mt-6'>
          By signing up, you agree to our{' '}
          <a href='#' className='text-black underline'>
            Terms
          </a>{' '}
          and{' '}
          <a href='#' className='text-black underline'>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};
