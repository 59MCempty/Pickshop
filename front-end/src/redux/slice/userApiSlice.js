import { apiSlice } from './apiSlice.js'
import { ORDER_URL, USER_URL } from '../../constants.js'


const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        logout: build.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: 'POST'
            })
        }),
        register: build.mutation({
            query: (data) => ({
                url: `${USER_URL}`,
                method: 'POST',
                body: data
            })
        }),
        profile: build.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: 'PUT',
                body: data
            })
        }),
        getUsers: build.query({
            query: () => ({
                url: USER_URL
            })
        }),
        deleteUser: build.mutation({
            query: (userId) => ({
                url: `${USER_URL}/${userId}`,
                method: "DELETE"
            })
        }),
        updateUser: build.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data.userId}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["User"]
        }),
        getUserDetails: build.query({
            query: (userId) => ({
                url: `${USER_URL}/${userId}`,
            }),
            keepUnusedDataFor: 5
        })
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserDetailsQuery
} = userApiSlice
