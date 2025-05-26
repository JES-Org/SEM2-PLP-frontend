// @ts-nocheck

'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useStudentClassroomQuery } from '@/store/classroom/classroomApi'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

import DiscussionChat from '../DiscussionChat'
import { MessageChatView } from './MessageChatView'
import { MessageMobileHeader } from './MessageMobileHeader'
import { MessageSidebar } from './MessageSidebar'

export const MessageDashboard = () => {
	const router = useRouter()
	const params = useParams()
	const pathname = usePathname()
	const currClassroomId = useSelector(selectCurrClassroomId) as
		| string
		| undefined
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const role = currUser.role === 0 ? 'student' : 'teacher'
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)

	const handleBackToClassrooms = () => {
		if (role === 'student') {
			router.back()
		}
		if (role === 'teacher') {
			router.back()
		}
		setIsSidebarOpen(true)
	}

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}

	return (
		<div className='flex h-screen pt-8 overflow-hidden w-full'>
			<MessageMobileHeader
				title={currClassroomId ? 'Chat' : 'Messages'}
				onMenuToggle={toggleSidebar}
				showBackButton={!!currClassroomId}
				onBack={handleBackToClassrooms}
			/>
			<MessageSidebar
				isOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			{currClassroomId ? (
				<div className='w-full'>
					<DiscussionChat typing={false} />
				</div>
			) : (
				<div className='flex-1 flex items-center justify-center'>
					<p className='text-gray-500'>Select a classroom to start chatting</p>
				</div>
			)}
		</div>
	)
}
