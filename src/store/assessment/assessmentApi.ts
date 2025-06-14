import {
	CheckAnswerResponse,
	CreateAssessementRequest,
	CreateAssessementResponse,
	CrossAssessmentResponse,
	GetAssessmentResponse,
	GetQuestionsResponse,
	PostSubmitAnswerRequest,
	PostSubmitAnswerResponse,
	PublishAssessmentResponse,
	Question,
	SingleAssessmentAnalyticsResponse,
} from '@/types/assessment/assessment.type'
import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReauth from '../baseApi/baseQueryWithReauth'

interface MinimalAssessment {
	id: string | number
	is_published?: boolean
}

const baseQueryWithReauth = createBaseQueryWithReauth(
	'http://localhost:8000/api/classroom',
)

export const assessmentApi = createApi({
	reducerPath: 'assessmentApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Question', 'Assessment'],
	endpoints: (builder) => ({
		createAssessment: builder.mutation<
			CreateAssessementResponse,
			CreateAssessementRequest
		>({
			query: (body) => ({
				url: `/${body.classroomId}/assessment/`,
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Assessment', id: 'LIST' }],
		}),
		getAssessments: builder.query<GetAssessmentResponse, string | undefined>({
			query: (classroomId) => ({
				url: `/${classroomId}/assessment`,
				method: 'GET',
			}),
			providesTags: (result, error, arg) =>
				result && Array.isArray(result.data)
					? [
							...result.data.map(({ id }: MinimalAssessment) => ({
								type: 'Assessment' as const,
								id,
							})),
							{ type: 'Assessment' as const, id: 'LIST' },
						]
					: [{ type: 'Assessment' as const, id: 'LIST' }],
		}),
		publishAssessment: builder.mutation<
			PublishAssessmentResponse,
			{ classroomId: string; assessmentId: string }
		>({
			query: ({ classroomId, assessmentId }) => ({
				url: `/${classroomId}/assessment/publish/${assessmentId}/`,
				method: 'PUT',
			}),
			invalidatesTags: (result, error, { assessmentId }) => [
				{ type: 'Assessment', id: 'LIST' },
				{ type: 'Assessment', id: assessmentId },
			],
		}),

		unpublishAssessment: builder.mutation<
			PublishAssessmentResponse,
			{ classroomId: string; assessmentId: string }
		>({
			query: ({ classroomId, assessmentId }) => ({
				url: `/${classroomId}/assessment/unpublish/${assessmentId}/`,
				method: 'PUT',
			}),
			invalidatesTags: (result, error, { assessmentId }) => [
				{ type: 'Assessment', id: 'LIST' },
				{ type: 'Assessment', id: assessmentId },
			],
		}),

		addQuestion: builder.mutation<
			any,
			{ classroomId: string; question: Question }
		>({
			query: ({ classroomId, question }) => ({
				url: `/${classroomId}/assessment/add-question/`,
				method: 'POST',
				body: question,
			}),
			invalidatesTags: (result, error, { question }) => [
				{ type: 'Question', id: question.assessmentId },
				{ type: 'Question', id: 'LIST' },
			],
		}),
		deleteQuestion: builder.mutation<
			any,
			{ classroomId: string; questionId: string; assessmentId?: string }
		>({
			query: ({ classroomId, questionId }) => ({
				url: `/${classroomId}/assessment/question/${questionId}/`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { assessmentId }) => [
				...(assessmentId
					? [{ type: 'Question' as const, id: assessmentId }]
					: []),
				{ type: 'Question', id: 'LIST' },
			],
		}),
		getQuestions: builder.query<
			GetQuestionsResponse,
			{ classroomId: string; assessmentId: string }
		>({
			query: ({ classroomId, assessmentId }) => ({
				url: `/${classroomId}/assessment/${assessmentId}`,
				method: 'GET',
			}),
			providesTags: (result, error, { assessmentId }) => [
				{ type: 'Question', id: assessmentId },
				{ type: 'Question', id: 'LIST' },
			],
		}),
		submitAssessment: builder.mutation<
			PostSubmitAnswerResponse,
			{ body: PostSubmitAnswerRequest; classroomId: string }
		>({
			query: ({ body, classroomId }) => ({
				url: `/${classroomId}/assessment/add-submission/`,
				method: 'POST',
				body,
			}),
		}),
		checkAnswer: builder.query<
			any,
			{ classroomId: string; submissionId: string }
		>({
			query: ({ classroomId, submissionId }) => ({
				url: `/${classroomId}/assessment/submission/${submissionId}`,
				method: 'GET',
			}),
		}),
		crossAssessmentAnalytics: builder.query<CrossAssessmentResponse, string>({
			query: (classroomId) => ({
				url: `/${classroomId}/assessment/analytics/cross-assessment`,
				method: 'GET',
			}),
		}),
		assessmentAnalyticsByTag: builder.query<
			CrossAssessmentResponse,
			{ tags: string[]; classroomId: string }
		>({
			query: ({ tags, classroomId }) => ({
				url: `/${classroomId}/assessment/analytics/`,
				method: 'POST',
				body: tags,
			}),
		}),
		assessmentAnalyticsById: builder.query<
			SingleAssessmentAnalyticsResponse,
			{ assessmentId: string; classroomId: string }
		>({
			query: ({ assessmentId, classroomId }) => ({
				url: `/${classroomId}/assessment/analytics/${assessmentId}`,
				method: 'GET',
			}),
		}),
		// aggregateAssessmentAnalytics: builder.query<
		// 	SingleAssessmentAnalyticsResponse[],
		// 	{ classroomId: string; assessmentIds: string[] }
		// >({
		// 	async queryFn(
		// 		{ classroomId, assessmentIds },
		// 		_queryApi,
		// 		_extraOptions,
		// 		fetchWithBQ,
		// 	) {
		// 		const results = await Promise.all(
		// 			assessmentIds.map(async (assessmentId, _) => {
		// 				const response = await fetchWithBQ({
		// 					url: `/${classroomId}/assessment/analytics/${assessmentId}`,
		// 					method: 'GET',
		// 				})
		// 				if (response.error) throw response.error
		// 				return response.data as SingleAssessmentAnalyticsResponse
		// 			}),
		// 		)
		// 		return { data: results }
		// 	},
		// }),
		gradeShortAnswers: builder.mutation<
			CheckAnswerResponse, // Assuming the response structure is similar (includes updated submission)
			{
				classroomId: string;
				assessmentId: string;
				submissionId: string;
				question_scores: Record<string, number>; // { "questionId": score }
			}
		>({
			query: ({ classroomId, assessmentId, submissionId, question_scores }) => ({
				url: `${classroomId}/assessment/${assessmentId}/submission/${submissionId}/grade/`,
				method: 'PATCH', // Or PUT
				body: { question_scores },
			}),
			invalidatesTags: (result, error, { assessmentId }) => [
				{ type: 'Assessment', id: assessmentId },
			],
		}),

		aggregateAssessmentAnalytics: builder.query<
			SingleAssessmentAnalyticsResponse[],
			string
		>({
			query: (classroomId) => ({
				url: `/${classroomId}/assessment/analytics/agregate`,
				method: 'GET',
			}),
		}),
		singleAssessmentScore: builder.query<
			CheckAnswerResponse,
			{ classroomId: string; studentId: string; assessmentId: string }
		>({
			query: ({ classroomId, studentId, assessmentId }) => ({
				url: `/${classroomId}/assessment/submission/student/${studentId}/assessment/${assessmentId}`,
				method: 'GET',
			}),
		}),
		aggregateSingleAssessmentScore: builder.query<
			CheckAnswerResponse[],
			{ classroomId: string; assessmentId: string; studentIds: string[] }
		>({
			async queryFn(
				{ classroomId, assessmentId, studentIds },
				_queryApi,
				_extraOptions,
				fetchWithBQ,
			) {
				if (!studentIds || studentIds.length === 0) {
					return { data: [] };
				}
				if (!assessmentId) {
					return { data: [] };
				}

				try {
					const promises = studentIds.map(async (studentId) => {
						const endpointUrl = `/${classroomId}/assessment/submission/student/${studentId}/assessment/${assessmentId}`;
						const response = await fetchWithBQ({
							url: endpointUrl,
							method: 'GET',
						});

						if (response.error) {
							return {
								isSuccess: false,
								message: `No submission found or error for student ${studentId}. Error: ${response.error.status || 'Unknown'}`,
								data: {
									id: `no-submission-placeholder-${studentId}-${assessmentId}`,
									studentId: studentId,
									assessmentId: assessmentId,
									answers: {},
									score: 0,
									createdAt: new Date().toISOString(),
									updatedAt: new Date().toISOString(),
								},
								errors: (response.error.data && typeof response.error.data === 'object' && 'errors' in response.error.data)
									? (response.error.data as any).errors
									: [JSON.stringify(response.error.data) || 'Unknown error details'],
							} as CheckAnswerResponse;
						}
						return response.data as CheckAnswerResponse;
					});

					const allAttemptedResults = await Promise.all(promises);

					const successfulSubmissionsOnly = allAttemptedResults.filter(
						(result) => result.isSuccess === true
					);

					return { data: successfulSubmissionsOnly };

				} catch (e: any) {
					return { error: { status: 'CUSTOM_ERROR', error: 'Aggregate scoring failed', data: { message: 'Failed to process aggregated scores due to an unexpected error.', details: e?.message } } };
				}
			},
		}),
	}),
})

export const {
	useSingleAssessmentScoreQuery,
	useAggregateSingleAssessmentScoreQuery,
	useAggregateAssessmentAnalyticsQuery,
	useCreateAssessmentMutation,
	useGetAssessmentsQuery,
	usePublishAssessmentMutation,
	useUnpublishAssessmentMutation,
	useAddQuestionMutation,
	useDeleteQuestionMutation,
	useGetQuestionsQuery,
	useSubmitAssessmentMutation,
	useCheckAnswerQuery,
	useCrossAssessmentAnalyticsQuery,
	useAssessmentAnalyticsByTagQuery,
	useAssessmentAnalyticsByIdQuery,
	useGradeShortAnswersMutation,
} = assessmentApi
