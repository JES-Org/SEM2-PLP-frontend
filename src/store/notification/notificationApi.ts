import { UnreadNotificationResponse } from "@/types/notification/notification.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import createBaseQueryWithReauth from '../baseApi/baseQueryWithReauth'

const baseQueryWithReauth = createBaseQueryWithReauth(
  'http://localhost:8000/api/notifications',
)

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Notifications'], // ✅ Define tag type
  endpoints: (builder) => ({
    // GET /notifications/unread/
    unreadNotifications: builder.query<UnreadNotificationResponse, void>({
      query: () => ({
        url: `/unread/`,
        method: "GET",
      }),
      providesTags: ['Notifications'], // ✅ Provides the 'Notifications' tag
    }),

    // PATCH /notifications/{notificationId}/mark-read/
    markNotificationAsRead: builder.mutation<any, { notificationId: number }>({
      query: ({ notificationId }) => ({
        url: `/${notificationId}/mark-read/`,
        method: "POST",
      }),
      invalidatesTags: ['Notifications'], // ✅ Invalidate the tag to refetch unread
    }),
  }),
});

export const {
  useUnreadNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = notificationApi;
