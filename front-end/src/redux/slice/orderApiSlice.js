import { apiSlice } from './apiSlice.js'
import { ORDER_URL, PAYPAL_URL } from '../../constants.js'


const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDER_URL,
                method: 'POST',
                body: { ...order }
            })
        }),
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `${ORDER_URL}/${id}`
            }),
            keepUnusedDataFor: 5
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDER_URL}/${orderId}/pay`,
                method: 'PUT',
                body: { ...details }
            })
        }),
        getPaypalClientId: builder.query({
            query: () => ({
                url: PAYPAL_URL
            }),
            keepUnusedDataFor: 5
        }),
        getMyOrder: builder.query({
            query: () => ({
                url: `${ORDER_URL}/mine`
            }),
            keepUnusedDataFor: 5
        }),
        getOrders: builder.query({
            query: () => ({
                url: ORDER_URL
            }),
            keepUnusedDataFor: 5
        }),
        OrderDelivered: builder.mutation({
            query: (id) => ({
                url: `${ORDER_URL}/${id}/deliver`,
                method: "PUT",
            })
        })
    })
})

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPaypalClientIdQuery,
    useGetMyOrderQuery,
    useGetOrdersQuery,
    useOrderDeliveredMutation
} = orderApiSlice
