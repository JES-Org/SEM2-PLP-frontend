// @ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTeacherClassroomQuery } from '@/store/classroom/classroomApi'
import { selectCurrClassroomId } from '@/store/features/classroomSlice'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import DiscussionChat from '../DiscussionChat'
import { MessageChatView } from './MessageChatView'
import { MessageMobileHeader } from './MessageMobileHeader'
import { MessageSidebar } from './MessageSidebar'
export const TeacherMessageDashboard = () => {
	const router = useRouter()
	const params = useParams()
	const pathname = usePathname()
	const currClassroomId = useSelector(selectCurrClassroomId) as
		| string
		| undefined
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)
	const handleBackToClassrooms = () => {
		router.push('/teacher/messages')
		setIsSidebarOpen(true)
	}
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen)
	}
	return (
		<div className='flex ml-64 md:ml-64 relative h-[calc(100vh-5rem)]'>
			<MessageMobileHeader
				title={currClassroomId ? 'Chat' : 'Messages'}
				onMenuToggle={toggleSidebar}
				showBackButton={!!currClassroomId}
				onBack={handleBackToClassrooms}
			/>
			<MessageSidebar isOpen={isSidebarOpen} />
			{currClassroomId ? (
				<DiscussionChat
					typing={false}
				/>
			) : (
				<div className='flex-1 flex items-center justify-center'>
					<p className='text-gray-500'>Select a classroom to start chatting</p>
				</div>
			)}
		</div>
	)
}
