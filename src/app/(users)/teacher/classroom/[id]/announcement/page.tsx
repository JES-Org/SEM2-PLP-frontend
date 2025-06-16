'use client'

import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetAnnouncementsQuery } from '@/store/announcement/announcementApi'
import { openDialog } from '@/store/features/announcementDialogSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { setNotifications } from '@/store/features/notificationSlice'
import { useUnreadNotificationsQuery } from '@/store/notification/notificationApi'
import { useDispatch, useSelector } from 'react-redux'

import Announcement from '@/components/Announcement'
import AnnouncementCreatingDialog from '@/components/AnnouncementCreatingDialog'
import AnnouncementDeleteDialog from '@/components/AnnouncementDeleteDialog'
import AnnouncementEditingDialog from '@/components/AnnouncementEditingDialog'
import AttachmentDialog from '@/components/AttachmentDialog'
import { Button } from '@/components/ui/button'

const AnnouncementPage = () => {
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()

	const {
		data: announcements,
		error,
		isLoading,
		isError,
		isFetching,
	} = useGetAnnouncementsQuery(currClassroomId)

	
	const { data } = useUnreadNotificationsQuery()
	dispatch(setNotifications(data?.data))

	return (
		<div className='md:ml-72  mr-24 mt-10 flex flex-col h-screen'>
			<AnnouncementCreatingDialog />
			<AttachmentDialog />
			<AnnouncementDeleteDialog />
			<AnnouncementEditingDialog />
			<Button
				className='self-end mb-3'
				onClick={() => dispatch(openDialog('create'))}
			>
				Create announcement
			</Button>
			<div className='flex-1 overflow-y-auto no-scrollbar'>
				{announcements?.data
					?.slice(0)
					.reverse()
					.map((announcement) => (
						<Announcement
							key={announcement.id}
							announcement={announcement}
							className='mb-4'
						/>
					))}
			</div>
		</div>
	)
}
export default AnnouncementPage
