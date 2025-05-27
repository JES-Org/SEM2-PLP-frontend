import {
	AddBatchRequest,
	AddBatchResponse,
	CreateClassroomRequest,
	CreateClassroomResponse,
	GetClassroomByIdResponse,
	SearchClassroomResponse,
	StudentClassroomResponse,
	TeacherClassroomResponse,
} from '@/types/classroom/classroom.type'
import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReauth from '../baseApi/baseQueryWithReauth'

const baseQueryWithReauth = createBaseQueryWithReauth(
	'http://localhost:8000/api/classroom',
)
export const classroomApi = createApi({
	reducerPath: 'classroomApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Classroom', 'TeacherClassroom', 'StudentClassroom'],
	endpoints: (builder) => ({
		createClassRoom: builder.mutation<
			CreateClassroomResponse,
			CreateClassroomRequest
		>({
			query: (body) => ({
				url: '/',
				method: 'POST',
				body,
			}),
			invalidatesTags: (result, error, { creatorId }) => [
				{ type: 'TeacherClassroom', id: creatorId },
				{ type: 'Classroom', id: 'LIST' },
			],
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
				url: '/add-batch/',
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
				method: 'GET',
			}),
			providesTags: (result, error, id) => [{ type: 'Classroom', id }],
		}),
		deleteClassroom: builder.mutation({
			query: (id) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { teacherId }) => [
				{ type: 'Classroom', id: 'LIST' },
				{ type: 'TeacherClassroom', id: teacherId },
			],
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
			query: (body) => ({
				url: '/add-student/',
				method: 'POST',
				body,
			}),
			invalidatesTags: (result, error, { classroomId }) => [
				{ type: 'Classroom', id: classroomId },
			],
		}),
		removeStudent: builder.mutation({
			query: ({ studentId, classroomId }) => ({
				url: `/remove-student/${classroomId}/${studentId}/`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, { classroomId }) => [
				{ type: 'Classroom', id: classroomId },
			],
		}),

		archiveClassroom: builder.mutation({
			query: (id) => ({
				url: `/${id}/archive/`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Classroom', id }],
		}),

		unarchiveClassroom: builder.mutation({
			query: (id) => ({
				url: `/${id}/unarchive/`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Classroom', id }],
		}),
	}),
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
	useArchiveClassroomMutation,
	useUnarchiveClassroomMutation,
} = classroomApi
