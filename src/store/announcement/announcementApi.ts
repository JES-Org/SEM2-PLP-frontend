import { 
  CreateAnnouncementRequest, 
  CreateAnnouncementResponse, 
  DeleteAnnouncementParams, 
  GetAnnouncementsResponse 
} from "@/types/announcement/announcement.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const announcementApi = createApi({
  reducerPath: "announcementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/classroom',
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem('currUser')!).token as string;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Announcements'],
  endpoints: (builder) => ({
    createAnnouncement: builder.mutation<CreateAnnouncementResponse, CreateAnnouncementRequest>({
      query: (body) => ({
        url: `/${body.classRoomId}/announcements`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { classRoomId }) => [
        { type: 'Announcements', id: classRoomId }
      ],
    }),
    makeAttachment: builder.mutation({
      query: ({ classRoomId, id, formData}) => ({
        url: `/${classRoomId}/announcements/attach/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { classRoomId }) => [
        { type: 'Announcements', id: classRoomId }
      ],
    }),
    getAttachment: builder.query({
      queryFn: async ({ classRoomId, announcementId, attachmentId }, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
            url: `/${classRoomId}/announcements/${announcementId}/attachments/${attachmentId}`,
            responseHandler: ((response) => response.blob())
        })
        var hiddenElement = document.createElement('a');
        var url = window.URL || window.webkitURL;
        var blobPDF = url.createObjectURL(result.data as Blob);
        hiddenElement.href = blobPDF;
        hiddenElement.target = '_blank';
        hiddenElement.download = 'attachment.pdf';
        hiddenElement.click();
        return { data: null }
    }
    }),
    getAnnouncements: builder.query<GetAnnouncementsResponse, string>({
      query: (classRoomId) => ({
        url: `/${classRoomId}/announcements`,
        method: "GET",
      }),
      providesTags: (result, error, classRoomId) => [
        { type: 'Announcements', id: classRoomId }
      ],
    }),
    deleteAnnouncement: builder.mutation<void, DeleteAnnouncementParams>({
      query: ({ classRoomId, announcementId }) => ({
        url: `/${classRoomId}/announcements/${announcementId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { classRoomId }) => [
        { type: 'Announcements', id: classRoomId }
      ],
    }),
  }),
});

export const { 
  useCreateAnnouncementMutation,
  useMakeAttachmentMutation,
  useGetAnnouncementsQuery,
  useDeleteAnnouncementMutation,
  useGetAttachmentQuery,
} = announcementApi;
