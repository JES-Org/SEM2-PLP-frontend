'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useGetAnnouncementsQuery } from '@/store/announcement/announcementApi'
import { openDialog } from '@/store/features/announcementDialogSlice'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { setNotifications } from '@/store/features/notificationSlice'
import { useUnreadNotificationsQuery } from '@/store/notification/notificationApi'
import {
	HttpTransportType,
	HubConnection,
	HubConnectionBuilder,
} from '@microsoft/signalr'
import { useDispatch, useSelector } from 'react-redux'

import Announcement from '@/components/Announcement'

const StudentAnnouncementPage = () => {
	const dispatch = useDispatch()
	const currClassroomId = useSelector(selectCurrClassroomId)
	const [conn, setConn] = useState<HubConnection | null>(null)
	const [forumConn, setForumConn] = useState<HubConnection | null>(null)
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const {
		data: announcements,
		error,
		isLoading,
		isError,
		isFetching,
	} = useGetAnnouncementsQuery(currClassroomId)

	useEffect(() => {
		const newConnection = new HubConnectionBuilder()
			.withUrl('http://localhost:5275/notificationhub', {
				skipNegotiation: true,
				transport: HttpTransportType.WebSockets,
				accessTokenFactory: () => currUser?.token! as string,
			})
			.withAutomaticReconnect()
			.build()

		newConnection
			.start()
			.then(() => {
				console.log('Notification connection started!')
				setConn(newConnection)
			})
			.catch((err) => console.log('Error while establishing connection', err))

		const newForumConnection = new HubConnectionBuilder()
			.withUrl('http://localhost:5082/forumHub', {
				skipNegotiation: true,
				transport: HttpTransportType.WebSockets,
				accessTokenFactory: () => currUser?.token! as string,
			})
			.withAutomaticReconnect()
			.build()

		newForumConnection
			.start()
			.then(() => {
				console.log('Forum connection started!')
				setForumConn(newForumConnection)
			})
			.catch((err) => console.log('Error while establishing connection', err))
	}, [])

	const { data } = useUnreadNotificationsQuery(currClassroomId!)
	dispatch(setNotifications(data?.data))

	console.log(JSON.stringify(data))

	return (
		<div className='ml-80 mr-24 mt-10 flex flex-col h-screen'>
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
export default StudentAnnouncementPage
