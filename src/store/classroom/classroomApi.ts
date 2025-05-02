import { 
  AddBatchRequest, 
  AddBatchResponse, 
  CreateClassroomRequest, 
  CreateClassroomResponse, 
  GetClassroomByIdResponse, 
  SearchClassroomResponse, 
  StudentClassroomResponse, 
  TeacherClassroomResponse 
} from "@/types/classroom/classroom.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const classroomApi = createApi({
  reducerPath: 'classroomApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5023/api/classroom', 
    prepareHeaders: (headers) => {
    const token = JSON.parse(localStorage.getItem('currUser')!).token as string
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['Classroom', 'TeacherClassroom', 'StudentClassroom'],
  endpoints: (builder) => ({
    createClassRoom: builder.mutation<CreateClassroomResponse, CreateClassroomRequest>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Classroom', id: 'LIST' }],
    }),
    editClassroom: builder.mutation({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Classroom', id }],
    }),
    addBatch: builder.mutation<AddBatchResponse, AddBatchRequest>({
      query: (body) => ({
        url: '/add-batch',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Classroom', id: 'LIST' }],
    }),
    studentClassroom: builder.query<StudentClassroomResponse, any>({
      query: (id) => ({
        url: `/student/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'StudentClassroom', id }],
    }),
    teacherClassroom: builder.query<TeacherClassroomResponse, any>({
      query: (id) => ({
        url: `/teacher/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'TeacherClassroom', id }],
    }),
    getClassroomById: builder.query<GetClassroomByIdResponse, any>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: (result, error, id) => [{ type: 'Classroom', id }],
    }),
    deleteClassroom: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Classroom', id }, { type: 'Classroom', id: 'LIST' }],
    }),
    searchClassroom: builder.query<SearchClassroomResponse, any>({
      query: (query) => ({
        url: '/search',
        method: 'GET',
        params: { query },
      }),
      providesTags: [{ type: 'Classroom', id: 'LIST' }],
    }),
    addStudent: builder.mutation({
      query: ({ studentId, classroomId }) => ({
        url: '/add-student',
        method: 'POST',
        params: { studentId, classroomId }
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Classroom', id: classroomId }],
    }),
    removeStudent: builder.mutation({
      query: ({ studentId, classroomId }) => ({
        url: '/remove-student',
        method: 'DELETE',
        params: { studentId, classroomId }
      }),
      invalidatesTags: (result, error, { classroomId }) => [{ type: 'Classroom', id: classroomId }],
    })
  })
})

export const { 
  useCreateClassRoomMutation, 
  useEditClassroomMutation, 
  useAddBatchMutation, 
  useStudentClassroomQuery, 
  useTeacherClassroomQuery, 
  useGetClassroomByIdQuery, 
  useDeleteClassroomMutation, 
  useSearchClassroomQuery, 
  useAddStudentMutation, 
  useRemoveStudentMutation,
} = classroomApi
