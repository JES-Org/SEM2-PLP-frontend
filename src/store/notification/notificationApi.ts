import { UnreadNotificationResponse } from "@/types/notification/notification.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5275/api/notifications",
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem('currUser')!).token as string;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    unreadNotifications: builder.query<UnreadNotificationResponse, string>({
      query: (classRoomId) => ({
        url: `/unread`,
        method: 'GET',
        params: {
          classRoomId
        },
      }),
    }),
    getNotifications: builder.query<any, {notificationId: string, classRoomId: string}>({
      query: ({notificationId, classRoomId}) => ({
        url: `/${notificationId}`,
        method: 'GET',
        params: {
          classRoomId
        },
      }),
      })
  }),
});

export const { useUnreadNotificationsQuery, useGetNotificationsQuery } = notificationApi;
