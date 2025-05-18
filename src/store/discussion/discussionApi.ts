import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { 
  CreateMessageRequest, 
  CreateMessageResponse, 
  EditMessageRequest, 
  EditMessageResponse,
  DeleteMessageResponse,
  GetAllMessagesResponse
} from "@/types/discussion/discussion.type";
import createBaseQueryWithReauth from "../baseApi/baseQueryWithReauth";

const baseQueryWithReauth = createBaseQueryWithReauth(
  "http://localhost:8000/api/forum"
);

export const discussionApi = createApi({
  reducerPath: "discussionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    createMessage: builder.mutation<CreateMessageResponse, CreateMessageRequest>({
      query: (body) => ({
        url: `/${body.classroomId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
    editMessage: builder.mutation<EditMessageResponse, EditMessageRequest>({
      query: (body) => ({
        url: `/${body.classroomId}/update-message`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
    deleteMessage: builder.mutation<DeleteMessageResponse, { classroomId: string, messageId: string }>({
      query: ({ classroomId, messageId }) => ({
        url: `/${classroomId}/delete-message`,
        method: 'DELETE',
        params: {
          messageId,
        },
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
    getAllMessages: builder.query<GetAllMessagesResponse, { classroomId: string, page: number, pageSize: number }>({
      query: ({ classroomId, page, pageSize }) => ({
        url: `/${classroomId}/messages`,
        method: 'GET',
        params: {
          page,
          pageSize,
        },
      }),
      providesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
  })
});

export const { 
  useCreateMessageMutation, 
  useEditMessageMutation, 
  useDeleteMessageMutation, 
  useGetAllMessagesQuery,
} = discussionApi;
