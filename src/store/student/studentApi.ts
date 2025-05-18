import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { StudentSignupResponse, StudentSignupRequest, StudentSigninResponse, StudentSigninRequest } from '@/types/auth/studentAuth.type'
import { EditStudentProfileRequest, GetSingleStudentResponse } from '@/types/student/student.type'
import createBaseQueryWithReauth from '../baseApi/baseQueryWithReauth'

const baseQueryWithReauth = createBaseQueryWithReauth(
'http://localhost:8000/api/user/'
)
export const studentAuthApi = createApi({
  reducerPath: 'studentAuthApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    studentSignup: builder.mutation<StudentSignupResponse, StudentSignupRequest>({
      query: (body) => ({
        url: '/register/',
        method: 'POST',
        body,
      }),
    }),
    studentSignin: builder.mutation<StudentSigninResponse, StudentSigninRequest>({
      query: (body) => ({
        url: '/login/',
        method: 'POST',
        body,
      }),
    }),
    getStudentById: builder.query<GetSingleStudentResponse, string>({
      query: (id) => ({
        url: `student/${id}`,
        method: 'GET'
      })
    }),
    aggregateGetStudentById: builder.query<GetSingleStudentResponse[], {studentIds: any[]}>({
      async queryFn({studentIds}, _queryApi, _extraOptions, fetchWithBQ) {
        const results = await Promise.all(studentIds.map(async (id, _) => {
          const response = await fetchWithBQ({
            url: `/${id}`,
            method: 'GET',
          });
          if (response.error) throw response.error;
          return response.data as GetSingleStudentResponse;
        }));
        return { data: results };
      }
    }),
    editStudentProfile: builder.mutation<any, EditStudentProfileRequest>({
      query: (body) => {
        const token = localStorage.getItem('currUser') ? JSON.parse(localStorage.getItem('currUser') as string).token : null;
    
        return {
          url: 'student/profile/update/',
          method: 'PUT',
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          }
        };
      },
    }),



    getStudentProfile: builder.query<GetSingleStudentResponse, void>({
      query: () => {
        const token = localStorage.getItem('currUser') 
          ? JSON.parse(localStorage.getItem('currUser') as string).token 
          : null;
        return {
          url: 'student/profile/update/',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    
}),
})

export const { 
  useStudentSignupMutation, 
  useStudentSigninMutation, 
  useGetStudentByIdQuery, 
  useEditStudentProfileMutation,
  useAggregateGetStudentByIdQuery,
  useGetStudentProfileQuery,

} = studentAuthApi