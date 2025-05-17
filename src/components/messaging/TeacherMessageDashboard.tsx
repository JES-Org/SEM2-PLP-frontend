// @ts-nocheck

'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTeacherClassroomQuery } from '@/store/classroom/classroomApi'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { MessageChatView } from './MessageChatView'
import { MessageMobileHeader } from './MessageMobileHeader'
import { MessageSidebar } from './MessageSidebar'

export const TeacherMessageDashboard = () => {
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const router = useRouter()
	const params = useParams()
	const pathname = usePathname()

	// Get classroomId from URL if available
	const classroomIdFromUrl = params?.id as string | undefined

	const [isSidebarOpen, setIsSidebarOpen] = useState(true)
	const { data: classrooms, isLoading } = useTeacherClassroomQuery(
		currUser.teacher?.id,
		{ skip: !currUser?.teacher },
	)

	// Sync selected classroom with URL
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
			// If we're already in a chat view, just update the ID
			router.replace(`/teacher/classroom/${classroomId}/chat`)
		} else {
			// Otherwise navigate to the chat view
			router.push(`/teacher/classroom/${classroomId}/chat`)
		}

		if (window.innerWidth < 768) {
			setIsSidebarOpen(false)
		}
	}

	const handleBackToClassrooms = () => {
		router.push('/teacher/messages')
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
		<div className='flex ml-64 md:ml-64 relative h-[calc(100vh-5rem)]'>
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
