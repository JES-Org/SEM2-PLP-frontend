import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { 
  CreateMessageRequest, 
  CreateMessageResponse, 
  EditMessageRequest, 
  EditMessageResponse,
  DeleteMessageResponse,
  GetAllMessagesResponse
} from "@/types/discussion/discussion.type";

export const discussionApi = createApi({
  reducerPath: "discussionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5082/api",
    prepareHeaders: (headers) => {
      const token = JSON.parse(localStorage.getItem('currUser')!).token as string;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    createMessage: builder.mutation<CreateMessageResponse, CreateMessageRequest>({
      query: (body) => ({
        url: `/${body.classroomId}/forum/create-message`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
    editMessage: builder.mutation<EditMessageResponse, EditMessageRequest>({
      query: (body) => ({
        url: `/${body.classroomId}/forum/update-message`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
    deleteMessage: builder.mutation<DeleteMessageResponse, { classroomId: string, messageId: string }>({
      query: ({ classroomId, messageId }) => ({
        url: `/${classroomId}/forum/delete-message`,
        method: 'DELETE',
        params: {
          messageId,
        },
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Messages', id: classroomId }],
    }),
    getAllMessages: builder.query<GetAllMessagesResponse, { classroomId: string, page: number, pageSize: number }>({
      query: ({ classroomId, page, pageSize }) => ({
        url: `/${classroomId}/forum/all-messages`,
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
