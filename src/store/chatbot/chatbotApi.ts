import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReauth from '../baseApi/baseQueryWithReauth'
import { LearningPath ,Task} from '@/types/learningPath/pathType';
const baseQueryWithReauth = createBaseQueryWithReauth(
	'http://localhost:8000/api/learning-path',
)



export const chatbotApi = createApi({
	reducerPath: 'chatbotApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['LearningPath'],
	endpoints: (builder) => ({
		greet: builder.mutation({
			query: (body) => ({
				url: `/greet/`,
				method: 'POST',
				body,
			}),
		}),
		detail: builder.mutation({
			query: (body) => ({
				url: `/detail/`,
				method: 'POST',
				body,
			}),
		}),
		generate: builder.mutation({
			query: (body) => ({
				url: `/generate/`,
				method: 'POST',
				body,
			}),
		}),
		save: builder.mutation({
			query: (body) => ({
				url: `/save/`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['LearningPath'],
		}),
		markAsCompleted: builder.mutation({
			query: ({ studentId, learningPathId }) => ({
				url: `/mark-completed/${learningPathId}/`,
				method: 'PUT',
				body: { studentId },
				headers: {
					'Content-Type': 'application/json',
				},
			}),
			invalidatesTags: ['LearningPath'],
		}),
		// getAllLearningPaths: builder.query({
		// 	query: (studentId: string) => ({
		// 		url: `/all-paths`,
		// 		method: 'GET',
		// 		params: { studentId },
		// 	}),
		// 	providesTags: ['LearningPath'],
		// }),

	getAllLearningPaths: builder.query<{ learningPaths: LearningPath[] }, string>({
		query: (studentId) =>
			
			 ({
			url: `/all-paths`,
			method: 'GET',
			params: { studentId },
			}),
      providesTags: ['LearningPath']
	}),
	
    toggleTaskCompletion: builder.mutation<
      { isSuccess: boolean; task: Task },
      { taskId: string }
    >({
      query: (body) => ({
        url: '/learning-path/toggle-task/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LearningPath'],
    }),	
		getLearningPath: builder.query({
			query: ({ studentId, learningPathId }) => ({
				url: `/${learningPathId}/get`,
				method: 'GET',
				params: { studentId },
			}),
		}),
		deleteLearningPath: builder.mutation({
			query: ( learningPathId) => ({
				url: `/${learningPathId}/delete/`,
				method: 'DELETE',
			}),
			invalidatesTags: ['LearningPath'],
		}),
		chatHistory: builder.query({
			query: (studentId) => ({
				url: `/chat-history`,
				method: 'GET',
				params: { studentId },
			}),
		}),
	}),
})

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
	useToggleTaskCompletionMutation,
} = chatbotApi
