import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../redux/api/auth/authApiSlice';
import React from 'react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    setError('');
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();

      // save token locally
      localStorage.setItem('jwtToken', result.token);
      localStorage.setItem('userName', result.userName);

      // redirect to home
      navigate('/home');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.data.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white font-sans">
      <div className="w-full max-w-[500px] p-5 text-center">
        <div className="w-[60px] h-[60px] bg-[#dcdcdc] rounded-full mx-auto mb-5"></div>

        <div className="border border-[#e0e0e0] rounded-xl p-6">
          <h2 className="text-[22px] mb-6">Sign in</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-4/5 p-3 mb-5 border border-[#ccc] rounded-md text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative w-4/5 mx-auto">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                className="w-full p-3 mb-5 border border-[#ccc] rounded-md text-sm"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-1/3 -translate-y-1/2 text-xs text-gray-600 cursor-pointer"
                onClick={() => setPasswordVisible((v) => !v)}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </span>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              className={`w-4/5 py-3.5 bg-black text-white rounded-full text-base mt-[30px] 
                ${(loading || !email || !password) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              type="submit"
              disabled={loading || !email || !password}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            <div className="flex justify-end w-4/5 mx-auto text-xs mt-4">
              <Link to="/reset-password" className="text-gray-800 underline">
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        <div className="my-6 flex items-center text-center before:content-[''] before:flex-1 before:border-b before:border-[#ccc] before:mr-2.5 after:content-[''] after:flex-1 after:border-b after:border-[#ccc] after:ml-2.5">
          New to our community
        </div>

        <button
          className="w-full py-3.5 bg-black text-white border border-black rounded-full text-base cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Create an account
        </button>

        <div className="text-center mt-8 text-xs text-gray-500">
          <span>© 2023 Vehicle Document Manager. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};
