import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url_back } from "../components/connection_url";

// define a service user a base URL
const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url_back
  }),

  endpoints: (builder) => ({
    // creating the user
    signupUser: builder.mutation({
      query: (user) => ({
        url: "/users/send-code",
        method: "POST",
        body: user
      })
    }),

    verifyUser: builder.mutation({
      query: ({ email, verificationCode }) => ({
        url: "/users/verify",
        method: "POST",
        body: {
          email,
          verificationCode
        }
      })
    }),

    // Updating the info
    signUpInfo: builder.mutation({
      query: (payload) => ({
        url: "/users/signupinfo",
        method: "PUT",
        body: payload
      })
    }),
    //login
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        body: {
          email,
          password
        }
      })
    }),

    logoutUser: builder.mutation({
      query: ({ email }) => ({
        url: `/users/logout?email=${email}`,
        method: "DELETE"
      })
    }),

    forgetPassword: builder.mutation({
      query: (user) => ({
        url: "/users/send-forgetpassword-code",
        method: "POST",
        body: user
      })
    }),

    verifyForgetPassword: builder.mutation({
      query: ({ email, verificationCode }) => ({
        url: "/users/verify-forgetpassword",
        method: "POST",
        body: {
          email,
          verificationCode
        }
      })
    }),

    changePassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/changepassword",
        method: "PUT",
        body: {
          email,
          password
        }
      })
    }),

    //Add Friend
    addFriend: builder.mutation({
      query: (payload) => ({
        url: "/users/addfriend",
        method: "PUT",
        body: payload
      })
    }),

    //remove Friend
    removeFriend: builder.mutation({
      query: (payload) => ({
        url: "/users/removefriend",
        method: "PUT",
        body: payload
      })
    }),

    cancelInvitation: builder.mutation({
      query: (payload) => ({
        url: "/users/cancelinvitation",
        method: "PUT",
        body: payload
      })
    }),

    declineInvitation: builder.mutation({
      query: (payload) => ({
        url: "/users/declineinvitation",
        method: "PUT",
        body: payload
      })
    }),

    acceptInvitation: builder.mutation({
      query: (payload) => ({
        url: "/users/acceptinvitation",
        method: "PUT",
        body: payload
      })
    }),

    getRequesters: builder.mutation({
      query: (payload) => ({
        url: "/users/getrequesters",
        method: "GET",
        params: payload
      })
    }),

    getUsersNotFriends: builder.mutation({
      query: (payload) => ({
        url: "/users/getusersandnotfriends",
        method: "GET",
        params: payload
      })
    }),

    getFriends: builder.mutation({
      query: (payload) => ({
        url: "/users/getfriends",
        method: "GET",
        params: payload
      })
    }),

    clubsget: builder.mutation({
      query: (payload) => ({
        url: "/users/Maps",
        method: "GET",
        body: payload
      })
    }),

    getconvs: builder.mutation({
      query: (payload) => ({
        url: "/chat/conversations",
        method: "GET",
        params: payload
      })
    }),

    getGroups: builder.mutation({
      query: (payload) => ({
        url: "/chat/groups",
        method: "GET",
        params: payload
      })
    }),

    getGifs: builder.mutation({
      query: (payload) => ({
        url: "/chat/getgifs",
        method: "GET",
        params: payload
      })
    }),

    getLastMessage: builder.mutation({
      query: (payload) => ({
        url: "/chat/getlastmessage",
        method: "GET",
        params: payload
      })
    }),

    deleteMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/chat/deletemessage?messageId=${messageId}`,
        method: "DELETE"
      })
    }),

    joinGroup: builder.mutation({
      query: (payload) => ({
        url: "/chat/groups/join",
        method: "PUT",
        body: payload
      })
    }),

    leaveGroup: builder.mutation({
      query: (payload) => ({
        url: "/chat/groups/leave",
        method: "PUT",
        body: payload
      })
    }),

    eventsByClubGet: builder.query({
      query: (clubId) => `/events/events/${clubId}`
    }),

    eventsget: builder.mutation({
      query: (payload) => ({
        url: "/events/events/",
        method: "GET",
        body: payload
      })
    }),

    findSender: builder.mutation({
      query: (payload) => ({
        url: "/chat/findsenderinfo/",
        method: "GET",
        params: payload
      })
    }),

    ticketsByEventGet: builder.query({
      query: (eventId) => `/tickets/tickets/${eventId}`
    }),
    ticketsByUserPost: builder.mutation({
      query: ({ eventId, userId, ticketId }) => ({
        url: "/tickets/tickets/getticket",
        method: "POST",
        body: {
          eventId,
          userId,
          ticketId
        }
      })
    }),
    userCurrentTicketsByuseridGet: builder.query({
      query: (userId) => `/users/tickets/${userId}`
    }),
    userInfoProfilePageGet: builder.query({
      query: (userId) => `/users/user/${userId}`
    }),

    updateUserImage: builder.mutation({
      query: (payload) => ({
        url: "/users/update-user-image",
        method: "PUT",
        body: payload
      })
    }),

    updateUserLocation: builder.mutation({
      query: (payload) => ({
        url: "/users/update-location",
        method: "PUT",
        body: payload
      })
    }),
    locationsGet: builder.mutation({
      query: (payload) => ({
        url: "/users/userlocations",
        method: "GET",
        body: payload
      })
    }),
    getFriendsWithSameTicket: builder.query({
      query: ({ userId, ticketId }) =>
        `/tickets/ticket/friends/${userId}/${ticketId}`
    })
  })
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useEventsgetMutation,
  useLogoutUserMutation,
  useVerifyUserMutation,
  useClubsgetMutation,
  useGetGroupsMutation,
  useGetconvsMutation,
  useJoinGroupMutation,
  useFindSenderMutation,
  useLeaveGroupMutation,
  useEventsByClubGetQuery,
  useTicketsByEventGetQuery,
  useTicketsByUserPostMutation,
  useSignUpInfoMutation,
  useAddFriendMutation,
  useGetRequestersMutation,
  useCancelInvitationMutation,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useRemoveFriendMutation,
  useUpdateUserImageMutation,
  useUserInfoProfilePageGetQuery,
  useUserCurrentTicketsByuseridGetQuery,
  useUpdateUserLocationMutation,
  useLocationsGetMutation,
  useGetGifsMutation,
  useDeleteMessageMutation,
  useForgetPasswordMutation,
  useVerifyForgetPasswordMutation,
  useChangePasswordMutation,
  useGetUsersNotFriendsMutation,
  useGetFriendsMutation,
  useGetLastMessageMutation,
  useGetFriendsWithSameTicketQuery
} = appApi;

export default appApi;
