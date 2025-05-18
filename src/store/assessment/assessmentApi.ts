import { 
  CreateAssessementResponse, 
  CreateAssessementRequest, 
  GetAssessmentResponse, 
  PublishAssessmentResponse, 
  Question,
  GetQuestionsResponse,
  PostSubmitAnswerResponse,
  PostSubmitAnswerRequest,
  CrossAssessmentResponse,
  SingleAssessmentAnalyticsResponse,
  CheckAnswerResponse
} from "@/types/assessment/assessment.type";
import { createApi} from "@reduxjs/toolkit/query/react";
import createBaseQueryWithReauth from "../baseApi/baseQueryWithReauth";



const baseQueryWithReauth= createBaseQueryWithReauth('http://localhost:8000/api/classroom');
export const assessmentApi = createApi({
  reducerPath: 'assessmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Question', 'Assessment'],
  endpoints: (builder) => ({
    createAssessment: builder.mutation<CreateAssessementResponse, CreateAssessementRequest>({
      query: (body) => ({
        url: `/${body.classroomId}/assessment/`,
        method: 'POST',
        body,
      })
    }),
    getAssessments: builder.query<GetAssessmentResponse, any>({
      query: (classroomId) => ({
        url: `/${classroomId}/assessment`,
        method: 'GET'
      }),
      providesTags: ['Assessment'],
    }),
    publishAssessment: builder.mutation<PublishAssessmentResponse, any>({
      query: ({classroomId, assessmentId}) => ({
        url: `/${classroomId}/assessment/publish/${assessmentId}/`,
        method: 'PUT'
      }),
      invalidatesTags: ['Assessment'],
    }),
    addQuestion: builder.mutation<any, {classroomId: string, question: Question}>({
      query: ({classroomId, question}) => ({
        url: `/${classroomId}/assessment/add-question/`,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation<any, {classroomId: string, questionId: string}>({
      query: ({classroomId, questionId}) => ({
        url: `/${classroomId}/assessment/question/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    getQuestions: builder.query<GetQuestionsResponse, {classroomId: string, assessmentId: string}>({
      query: ({ classroomId, assessmentId }) => ({
        url: `/${classroomId}/assessment/${assessmentId}`,
        method: 'GET',
      }),
      providesTags: ['Question'],
    }),
    submitAssessment: builder.mutation<PostSubmitAnswerResponse, {body: PostSubmitAnswerRequest, classroomId: string}>({
      query: ({body, classroomId}) => ({
        url: `/${classroomId}/assessment/add-submission/`,
        method: 'POST',
        body,
      })
    }),
    checkAnswer: builder.query<any, {classroomId: string, submissionId: string}>({
      query: ({classroomId, submissionId}) => ({
        url: `/${classroomId}/assessment/submission/${submissionId}`,
        method: 'GET',
      })
    }),
    crossAssessmentAnalytics: builder.query<CrossAssessmentResponse, string>({
      query: (classroomId) => ({
        url: `/${classroomId}/assessment/analytics/cross-assessment`,
        method: 'GET',
      })
    }),
    assessmentAnalyticsByTag: builder.query<CrossAssessmentResponse, {tags: string[], classroomId: string}>({
      query: ({tags, classroomId}) => ({
        url: `/${classroomId}/assessment/analytics/`,
        method: 'POST',
        body: tags,
      })
    }),
    assessmentAnalyticsById: builder.query<SingleAssessmentAnalyticsResponse, {assessmentId: string, classroomId: string}>({
      query: ({assessmentId, classroomId}) => ({
        url: `/${classroomId}/assessment/analytics/${assessmentId}`,
        method: 'GET',
      })
    }),
    aggregateAssessmentAnalytics: builder.query<SingleAssessmentAnalyticsResponse[], {classroomId: string, assessmentIds: string[]}>({
      async queryFn({classroomId, assessmentIds}, _queryApi, _extraOptions, fetchWithBQ) {
        const results = await Promise.all(assessmentIds.map(async (assessmentId, _) => {
          const response = await fetchWithBQ({
            url: `/${classroomId}/assessment/analytics/${assessmentId}`,
            method: 'GET',
          });
          if (response.error) throw response.error;
          return response.data as SingleAssessmentAnalyticsResponse;
        }));
        return { data: results };
      }
    }),
    singleAssessmentScore: builder.query<CheckAnswerResponse, {classroomId: string, studentId: string, assessmentId: string}>({
      query: ({classroomId, studentId, assessmentId}) => ({
        url: `/${classroomId}/assessment/submission/student/${studentId}/assessment/${assessmentId}`,
        method: 'GET',
      }),
    }),
    aggregateSingleAssessmentScore: builder.query<CheckAnswerResponse[], {classroomId: string, assessmentId: string, studentIds: any[]}>({
      async queryFn({classroomId, assessmentId, studentIds}, _queryApi, _extraOptions, fetchWithBQ) {
        const results = await Promise.all(studentIds.map(async (studentId, _) => {
          const response = await fetchWithBQ({
            url: `/${classroomId}/assessment/submission/student/${studentId}/assessment/${assessmentId}`,
            method: 'GET',
          });
          if (response.error) throw response.error;
          return response.data as CheckAnswerResponse;
        }));
        return { data: results };
      }
    }),
  })
})


export const { 
  useSingleAssessmentScoreQuery,
  useAggregateSingleAssessmentScoreQuery,
  useAggregateAssessmentAnalyticsQuery,
  useCreateAssessmentMutation, 
  useGetAssessmentsQuery, 
  usePublishAssessmentMutation,
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionsQuery,
  useSubmitAssessmentMutation,
  useCheckAnswerQuery,
  useCrossAssessmentAnalyticsQuery,
  useAssessmentAnalyticsByTagQuery,
  useAssessmentAnalyticsByIdQuery,
} = assessmentApi;