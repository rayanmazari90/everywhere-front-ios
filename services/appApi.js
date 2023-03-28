
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://192.168.1.33:5001",
    }),

    endpoints: (builder) => ({
        // creating the user
        signupUser: builder.mutation({
            query: (user) => ({
                url: "/users/send-code",
                method: "POST",
                body: user,
            }),
        }),

        //login
        loginUser: builder.mutation({
            query: ({ email, password }) => ({
                url: "/users/login",
                method: "POST",
                body: {
                    email,
                    password,
                },
            }),
        }),
        logoutUser: builder.mutation({
            query: (payload) => ({
                url: "users/logout",
                method: "DELETE",
                body: payload,
            }),
        }),

        verifyUser: builder.mutation({
            query: (user) => ({
                url: "/users/verify",
                method: "GET",
                body: user,
            }),
        }),
        
        clubs: builder.mutation({
            query: (user) => ({
                url: "/users/Maps",
                method: "GET",
                body: user,
            }),
        }),

    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useVerifyUserMutation } = appApi;

export default appApi;


