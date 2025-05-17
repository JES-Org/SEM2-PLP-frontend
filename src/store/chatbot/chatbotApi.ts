import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiMessageType } from "@/types/Message";
import createBaseQueryWithReauth from "../baseApi/baseQueryWithReauth";

const baseQueryWithReauth = createBaseQueryWithReauth(
  'http://localhost:8000/api/classroom',
)
export const chatbotApi = createApi({
  reducerPath: "chatbotApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LearningPath","Messages"],
  endpoints: (builder) => ({
    greet: builder.mutation({
      query: (body) => ({
        url: `/greet`,
        method: "POST",
        body,
      }),
    }),
    detail: builder.mutation({
      query: (body) => ({
        url: `/detail`,
        method: "POST",
        body,
      }),
    }),
    generate: builder.mutation({
      query: (body) => ({
        url: `/generate`,
        method: "POST",
        body,
      }),
    }),
    save: builder.mutation({
      query: (body) => ({
        url: `/save`,
        method: "POST",
        body,
      }),
    }),
    markAsCompleted: builder.mutation({
      query: ({ studentId, learningPathId }) => ({
        url: `/learning-paths/${learningPathId}`,
        method: "PUT",
        body: JSON.stringify({ "studentId": studentId }),
      }),
      invalidatesTags: ["LearningPath"],
    }),
    getAllLearningPaths: builder.query({
      query: (studentId: string) => ({
        url: `/learning-paths`,
        method: "GET",
        params: { studentId },
      }),
      providesTags: ["LearningPath"],
    }),
    getLearningPath: builder.query({
      query: ({ studentId, learningPathId }) => ({
        url: `/learning-paths/${learningPathId}`,
        method: "GET",
        params: { studentId },
      }),
    }),
    deleteLearningPath: builder.mutation({
      query: ({ studentId, learningPathId }) => ({
        url: `/learning-paths/${learningPathId}`,
        method: "DELETE",
        body: JSON.stringify({ "studentId": studentId })
      }),
    }),
    chatHistory: builder.query({
      query: (studentId) => ({
        url: `/chat-history`,
        method: "GET",
        params: { studentId },
      }),
    }),

    getMessagesByClassroom: builder.query<ApiMessageType[], string>({
      query: (classRoomId) => ({
        url: `/chat/${classRoomId}/messages/`, 
        method: "GET",
      }),
      providesTags: (result, error, classRoomId) => [
        { type: "Messages", id: classRoomId },
      ],
    }),
  }),
});

export const {
  useGreetMutation, 
  useDetailMutation, 
  useGenerateMutation, 
  useSaveMutation,
  useGetAllLearningPathsQuery, 
  useGetLearningPathQuery,
  useDeleteLearningPathMutation, 
  useMarkAsCompletedMutation,
  useChatHistoryQuery,
  useGetMessagesByClassroomQuery,
} = chatbotApi;
