// @ts-nocheck

'use client'

import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStudentClassroomQuery } from '@/store/classroom/classroomApi'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { MessageChatView } from './MessageChatView'
import { MessageMobileHeader } from './MessageMobileHeader'
import { MessageSidebar } from './MessageSidebar'
import { useSelector } from 'react-redux'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import DiscussionChat from '../DiscussionChat'

export const MessageDashboard = () => {
	const router = useRouter()
	const params = useParams()
	const pathname = usePathname()
   	const currClassroomId = useSelector(selectCurrClassroomId) as string | undefined
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const role = currUser.role === 0 ? 'student' : 'teacher'
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)


	const handleBackToClassrooms = () => {

		if (role === 'student') { 
		router.push('/student/messages')

		}
		if (role === 'teacher') {
		router.push('/teacher/messages')
		}
		setIsSidebarOpen(true)
	}

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}

	return (
		<div className='flex md:ml-64 h-screen'>
			<MessageMobileHeader
				title={currClassroomId ? 'Chat' : 'Messages'}
				onMenuToggle={toggleSidebar}
				showBackButton={!!currClassroomId}
				onBack={handleBackToClassrooms}
			/>
				<MessageSidebar
					isOpen={isSidebarOpen}
				/>
			      {currClassroomId ? (
				<div className='w-full'>
             	<DiscussionChat
					typing={false}
				/>
				</div>
			
			) : (
				<div className='flex-1 flex items-center justify-center'>
					<p className='text-gray-500'>Select a classroom to start chatting</p>
				</div>
			)}
		</div>
	)
}
