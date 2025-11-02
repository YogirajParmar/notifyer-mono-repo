import { apiSlice } from '../index';
import { TCreateDocumnet } from './document.types';

export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Fetch all documents
     */
    getDocuments: builder.query({
      query: () => ({
        url: '/docs/puc',
        method: 'GET',
      }),
      providesTags: ['documents'],
    }),

    /**
     * Create a new document
     */
    createDocument: builder.mutation({
      query: (document: TCreateDocumnet) => ({
        url: '/docs/puc',
        method: 'POST',
        body: document,
      }),
      invalidatesTags: ['documents', 'stats'],
    }),

    /**
     * Update a document
     */
    updateDocument: builder.mutation({
      query: ({ id, document }: { id: string; document: TCreateDocumnet }) => ({
        url: `/docs/puc/${id}`,
        method: 'PUT',
        body: document,
      }),
      invalidatesTags: ['documents', 'stats'],
    }),

    /**
     * Delete a document
     */
    deleteDocument: builder.mutation({
      query: (id: string) => ({
        url: `/docs/puc/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['documents', 'stats'],
    }),

    /**
     * Get document stats
     */
    getStats: builder.query({
      query: () => ({
        url: 'docs/stats',
        method: 'GET',
      }),
      providesTags: ['stats'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetStatsQuery,
} = documentApiSlice;
