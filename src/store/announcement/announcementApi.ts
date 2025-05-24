import {
	CreateAnnouncementRequest,
	CreateAnnouncementResponse,
	DeleteAnnouncementParams,
	GetAnnouncementsResponse,
} from '@/types/announcement/announcement.type'
import { createApi } from '@reduxjs/toolkit/query/react'

import createBaseQueryWithReauth from '../baseApi/baseQueryWithReauth'

const baseQueryWithReauth = createBaseQueryWithReauth(
	'http://localhost:8000/api/classroom',
)
export const announcementApi = createApi({
	reducerPath: 'announcementApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Announcements'],
	endpoints: (builder) => ({
		createAnnouncement: builder.mutation<
			CreateAnnouncementResponse,
			CreateAnnouncementRequest
		>({
			query: (body) => ({
				url: `/${body.classRoomId}/announcements/`,
				method: 'POST',
				body,
			}),
			invalidatesTags: (result, error, { classRoomId }) => [
				{ type: 'Announcements', id: classRoomId },
			],
		}),
		makeAttachment: builder.mutation({
			query: ({ classRoomId, id, formData }) => ({
				url: `/${classRoomId}/announcements/attach/${id}/`,
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: (result, error, { classRoomId }) => [
				{ type: 'Announcements', id: classRoomId },
			],
		}),
		getAttachment: builder.query({
			queryFn: async (
				{ classRoomId, announcementId, attachmentId },
				api,
				extraOptions,
				baseQuery,
			) => {
				const result = await baseQuery({
					url: `/${classRoomId}/announcements/${announcementId}/attachments/${attachmentId}/`,
					responseHandler: (response) => response.blob(),
				})

				// Get filename from Content-Disposition header
				const contentDisposition = (
					result.meta as { response?: Response }
				)?.response?.headers.get('Content-Disposition')
				let filename = 'attachment'
				if (contentDisposition) {
					const filenameMatch = contentDisposition.match(
						/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
					)
					if (filenameMatch && filenameMatch[1]) {
						filename = filenameMatch[1].replace(/['"]/g, '')
					}
				}

				const hiddenElement = document.createElement('a')
				const url = window.URL || window.webkitURL
				const blobUrl = url.createObjectURL(result.data as Blob)

				hiddenElement.href = blobUrl
				hiddenElement.target = '_blank'
				hiddenElement.download = filename // Use the extracted filename
				hiddenElement.click()

				// Clean up
				setTimeout(() => {
					url.revokeObjectURL(blobUrl)
				}, 100)

				return { data: null }
			},
		}),

		getAnnouncements: builder.query<GetAnnouncementsResponse, string>({
			query: (classRoomId) => ({
				url: `/${classRoomId}/announcements`,
				method: 'GET',
			}),
			providesTags: (result, error, classRoomId) => [
				{ type: 'Announcements', id: classRoomId },
			],
		}),
		deleteAnnouncement: builder.mutation<void, DeleteAnnouncementParams>({
			query: ({ classRoomId, announcementId }) => ({
				url: `/${classRoomId}/announcements/${announcementId}/`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { classRoomId }) => [
				{ type: 'Announcements', id: classRoomId },
			],
    }),
    
		updateAnnouncement: builder.mutation<
			any,
			{ id: string; classRoomId: string; title: string; content: string }
		>({
			query: ({ id, classRoomId, title, content }) => ({
				url: `/${classRoomId}/announcements/${id}/edit/`,
				method: 'PUT',
				body: { title, content },
			}),
	     invalidatesTags: (result, error, { classRoomId }) => [
				{ type: 'Announcements', id: classRoomId },
				{ type: 'Announcements', id: 'LIST' },
			],		}),

		deleteAttachment: builder.mutation<
			void,
			{
				classRoomId: string
				attachmentId: string
			}
		>({
			query: ({ classRoomId, attachmentId }) => ({
				url: `/announcements/attachments/${attachmentId}/delete/`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { classRoomId }) => [
				{ type: 'Announcements', id: classRoomId },
				{ type: 'Announcements', id: 'LIST' },
			],
		}),
	}),
})

export const {
	useCreateAnnouncementMutation,
	useMakeAttachmentMutation,
	useGetAnnouncementsQuery,
	useDeleteAnnouncementMutation,
	useGetAttachmentQuery,
  useDeleteAttachmentMutation,
  useUpdateAnnouncementMutation,
} = announcementApi
