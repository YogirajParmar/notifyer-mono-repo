import { apiSlice } from '../index';
import { Credentials, SignUp } from './auth.types';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login
     */
    login: builder.mutation({
      query: (credentials: Credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),

    /**
     * Sign up
     */
    signup: builder.mutation({
      query: (credentials: SignUp) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: credentials,
      }),
    }),

    /**
     * Reset password
     */
    resetPassword: builder.mutation({
      query: (credentials: Credentials) => ({
        url: '/auth/reset-password',
        method: 'PUT',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useResetPasswordMutation } = authApiSlice;
