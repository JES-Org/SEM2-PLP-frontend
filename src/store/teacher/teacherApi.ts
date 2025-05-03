import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TeacherSignupRequest, TeacherSignupResponse } from '@/types/auth/teacherAuth.type'
import { GetSingleTeacherResponse, EditTeacherProfileRequest } from '@/types/teacher/teacher.type'

export const teacherAuthApi = createApi({
  reducerPath: 'teacherAuthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user/' }),
  endpoints: (builder) => ({
    teacherSignup: builder.mutation<TeacherSignupResponse, TeacherSignupRequest>({
      query: (body) => ({
        url: '/register/',
        method: 'POST',
        body,
      }),
    }),
    teacherSignin: builder.mutation({
      query: (body) => ({
        url: '/login/',
        method: 'POST',
        body,
    }),
  }),
    getTeacherById: builder.query<GetSingleTeacherResponse, string>({
      query: (id) => ({
        url: `teacher/${id}`,
        method: 'GET',
      })
    }),
    editTeacherProfile: builder.mutation<any, EditTeacherProfileRequest>({
      query: (body) => {
        const token = localStorage.getItem('currUser') ? JSON.parse(localStorage.getItem('currUser') as string).token : null;
    
        return {
          url: 'teacher/profile/update/',
          method: 'PUT',
          body,
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
      }
    }),
    getTeacherProfile: builder.query<GetSingleTeacherResponse, void>({
      query: () => {
        const token = localStorage.getItem('currUser') 
          ? JSON.parse(localStorage.getItem('currUser') as string).token 
          : null;
    
        return {
          url: 'teacher/profile/update/',
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
  useTeacherSignupMutation, 
  useTeacherSigninMutation, 
  useGetTeacherByIdQuery, 
  useEditTeacherProfileMutation,
  useGetTeacherProfileQuery, 
} = teacherAuthApi