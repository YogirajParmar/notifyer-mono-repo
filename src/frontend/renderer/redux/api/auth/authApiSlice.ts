import { apiSlice } from '../index';
import { SignUp } from './auth.types';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (credentials: SignUp) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: credentials
      })
    })
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
