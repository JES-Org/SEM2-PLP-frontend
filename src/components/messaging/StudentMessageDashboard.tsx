// @ts-nocheck

'use client'
import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStudentClassroomQuery } from '@/store/classroom/classroomApi'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { MessageChatView } from './MessageChatView'
import { MessageMobileHeader } from './MessageMobileHeader'
import { MessageSidebar } from './MessageSidebar'

export const StudentMessageDashboard = () => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const router = useRouter()
	const params = useParams()
	const pathname = usePathname()

	const classroomIdFromUrl = params?.id as string | undefined

	const [isSidebarOpen, setIsSidebarOpen] = useState(true)

	const { data: classrooms, isLoading } = useStudentClassroomQuery(
		currUser.student?.id,
		{ skip: !currUser?.student },
	)

	useEffect(() => {
		if (classroomIdFromUrl && classrooms?.data) {
			const isValidClassroom = classrooms.data.some(
				(c) => c.id === classroomIdFromUrl,
			)
			if (isValidClassroom) {
				setIsSidebarOpen(window.innerWidth >= 768)
			}
		}
	}, [classroomIdFromUrl, classrooms])

	const handleClassroomSelect = (classroomId: string) => {
		if (pathname.includes('/chat')) {
			router.replace(`/student/classroom/${classroomId}/messages`)
		} else {
			router.push(`/student/classroom/${classroomId}/messages`)
		}

		if (window.innerWidth < 768) {
			setIsSidebarOpen(false)
		}
	}

	const handleBackToClassrooms = () => {
		router.push('/student/messages')
		setIsSidebarOpen(true)
	}

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				Loading...
			</div>
		)
	}

	return (
		<div className='flex md:ml-64 relative h-[calc(100vh-5rem)]'>
			<MessageMobileHeader
				title={classroomIdFromUrl ? 'Chat' : 'Messages'}
				onMenuToggle={toggleSidebar}
				showBackButton={!!classroomIdFromUrl}
				onBack={handleBackToClassrooms}
			/>

			{classrooms?.data && (
				<MessageSidebar
					classrooms={classrooms.data}
					selectedClassroom={classroomIdFromUrl}
					onSelect={handleClassroomSelect}
					isOpen={isSidebarOpen}
				/>
			)}

			{classroomIdFromUrl ? (
				<MessageChatView
					classRoomId={classroomIdFromUrl}
					isMobile={window.innerWidth < 768}
					onBackToClassrooms={handleBackToClassrooms}
				/>
			) : (
				<div className='flex-1 flex items-center justify-center'>
					<p className='text-gray-500'>Select a classroom to start chatting</p>
				</div>
			)}
		</div>
	)
}
