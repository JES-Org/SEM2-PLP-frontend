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
	setIsSidebarOpen: (open: boolean) => void
}

export const MessageSidebar = ({
	isOpen,
	setIsSidebarOpen,
}: MessageSidebarProps) => {
	const dispatch = useDispatch()
	const [selectedClassroomId, setSelectedClassroomId] = useState('')
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const role = currUser.role === 0 ? 'student' : 'teacher'

	const router = useRouter()
	const searchParams = useSearchParams()
	const { data: studentData } = useStudentClassroomQuery(currUser.student?.id, {
		skip: currUser.role !== 0 || !currUser?.student,
	})

	const { data: teacherData } = useTeacherClassroomQuery(currUser.teacher?.id, {
		skip: currUser.role !== 1 || !currUser?.teacher,
	})

	const classrooms = role === 'student' ? studentData?.data : teacherData?.data

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
			setIsSidebarOpen(false)
		}
	}

	return (
		<aside
			className={cn(
				'transition-transform duration-300 ease-in-out md:translate-x-0 fixed md:static z-20 bg-gray-50 dark:bg-gray-800 border-r h-full w-4/5 max-w-xs',
				{
					'-translate-x-full': !isOpen,
					'translate-x-0': isOpen,
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
