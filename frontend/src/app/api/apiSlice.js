
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice.js'

const baseQuery = fetchBaseQuery({
    // CHANGE 1: Port changed to backend (5001), not frontend (5173)
    baseUrl: 'http://localhost:5001', 
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    // CHANGE 2: Check for 401 (Unauthorized) as well as 403
    if (result?.error?.status === 401 || result?.error?.status === 403) {
        console.log('Token expired, attempting refresh...')

        // CHANGE 3: Send refresh request
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            const user = api.getState().auth.user
            // Store the new token in Redux
            api.dispatch(setCredentials({ ...refreshResult.data, user }))

            // CHANGE 4: Retry the original query with the new token
            result = await baseQuery(args, api, extraOptions)
        } else {
            // CHANGE 5: If refresh fails, log the user out to clear state
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({
        // Endpoints go here
    })
})