'use client'

import { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useStudentClassroomQuery,
	useTeacherClassroomQuery,
} from '@/store/classroom/classroomApi'
import { setCurrClassroomId } from '@/store/features/classroomSlice'
import { Classroom } from '@/types/classroom/classroom.type'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'

import { cn } from '@/lib/utils'

interface MessageSidebarProps {
	isOpen: boolean
}

export const MessageSidebar = ({ isOpen }: MessageSidebarProps) => {
	const dispatch = useDispatch()
	const [selectedClassroomId, setSelectedClassroomId] = useState('')
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const role = currUser.role === 0 ? 'student' : 'teacher'

	const router = useRouter()
	const searchParams = useSearchParams()
	let classrooms;
	if (role === 'student') {
		const { data: responseData, isLoading } = useStudentClassroomQuery(
			currUser.student?.id,
			{ skip: !currUser?.student },
		)
		 classrooms = responseData?.data 
	} else if (role === 'teacher') {
		const { data: responseData, isLoading } = useTeacherClassroomQuery(
			currUser.teacher?.id,
			{ skip: !currUser?.teacher },
		)
		 classrooms = responseData?.data
	}

	// Update selected from query param on mount
	useEffect(() => {
		const classroomIdFromQuery = searchParams.get('classroomId')
		if (classroomIdFromQuery) {
			setSelectedClassroomId(classroomIdFromQuery)
		}
	}, [searchParams])
	const handleClassroomSelect = (classroomId: string, className: string) => {
		setSelectedClassroomId(classroomId)
		dispatch(setCurrClassroomId(classroomId))
		if (role === 'student') {
			router.push(`/student/messages?classroom=${className}`)
		}
		if (role === 'teacher') {
			router.push(`/teacher/classroom/messages?classroom=${className}`)
		}
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			// You might need to close sidebar here depending on UX
		}
	}

	return (
		<aside
			className={cn(
				'w-64 border-r bg-gray-50 dark:bg-gray-800 z-20 md:static fixed left-0 mt-4 transform transition-transform duration-300 ease-in-out',
				{
					'-translate-x-full':
						!isOpen && typeof window !== 'undefined' && window.innerWidth < 768,
					'translate-x-0':
						isOpen || typeof window === 'undefined' || window.innerWidth >= 768,
				},
			)}
		>
			<div className='p-4 border-b mt-10 md:mt-0'>
				<h2 className='text-lg font-semibold'>Chats in Classrooms</h2>
			</div>
			<div className='overflow-y-auto h-[calc(100%-57px)]'>
				{(classrooms ?? []).map((classroom) => {
					const isSelected =
						String(classroom.id) === String(selectedClassroomId)

					return (
						<div
							key={classroom.id}
							className={cn(
								'p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
								{
									'bg-gray-200 dark:bg-gray-800': isSelected,
								},
							)}
							onClick={() =>
								handleClassroomSelect(String(classroom.id), classroom.name)
							}
						>
							<h3 className='font-medium truncate'>{classroom.name}</h3>
							<p className='text-sm text-gray-500 dark:text-gray-400 truncate'>
								{classroom.courseNo}
							</p>
						</div>
					)
				})}
			</div>
		</aside>
	)
}
