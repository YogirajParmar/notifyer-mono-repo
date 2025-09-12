import { apiSlice } from '../index';

export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: () => ({
        url: '/docs/puc',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetDocumentsQuery } = documentApiSlice;
