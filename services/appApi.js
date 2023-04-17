
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {url_back}  from "../components/connection_url";

// define a service user a base URL

const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: url_back,
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
            query: ({ email, verificationCode }) => ({
              url: "/users/verify",
              method: "POST",
              body: {
                email,
                verificationCode,
              },
            }),
          }),
        
        clubsget: builder.mutation({
            query: (payload) => ({
                url: "/users/Maps",
                method: "GET",
                body: payload,
            }),
        }),

    }),
});

export const { useSignupUserMutation, useLoginUserMutation, useLogoutUserMutation, useVerifyUserMutation, useClubsgetMutation } = appApi;

export default appApi;


