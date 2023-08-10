import { PRODUCTS_URL } from '../../constants.js'
import { apiSlice } from './apiSlice.js'

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getProducts: build.query({
            query: ({ keyword, pageNumber }) => ({
                url: PRODUCTS_URL,
                params: { keyword, pageNumber }
            }),
            keepUnusedDataFor: 5,
            providesTags: ['Products']
        }),
        getProductDetails: build.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: build.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'POST'
            }),
            invalidatesTags: ['Product']
        }),
        updateProduct: build.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Product']
        }),
        uploadImageProduct: build.mutation({
            query: (data) => ({
                url: '/api/upload',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Product']
        }),
        deleteProduct: build.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE'
            })
        }),
        createReviewProduct: build.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Product']
        }),
        getTopProducts: build.query({
            query: () => ({
                url: `${PRODUCTS_URL}/top`
            }),
            keepUnusedDataFor: 5
        }),
    })
})

export const {
    useGetProductsQuery,
    useGetProductDetailsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadImageProductMutation,
    useDeleteProductMutation,
    useCreateReviewProductMutation,
    useGetTopProductsQuery
} = productApiSlice
