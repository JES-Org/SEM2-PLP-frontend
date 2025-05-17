'use client'

import { Classroom } from '@/types/classroom/classroom.type'

import { cn } from '@/lib/utils'

interface MessageSidebarProps {
	classrooms: Classroom[]
	selectedClassroom: string | null
	onSelect: (classroomId: string) => void
	isOpen: boolean
}

export const MessageSidebar = ({
	classrooms,
	selectedClassroom,
	onSelect,
	isOpen,
}: MessageSidebarProps) => {
	return (
		<aside
			className={cn(
				'w-64 border-r bg-gray-50 dark:bg-gray-800 z-20 md:static fixed  left-0 mt-4 transform transition-transform duration-300 ease-in-out',
				{
					'-translate-x-full': !isOpen && window.innerWidth < 768,
					'translate-x-0': isOpen || window.innerWidth >= 768,
				},
			)}
		>
			<div className='p-4 border-b mt-10 md:mt-0'>
				<h2 className='text-lg font-semibold'> chats in Classrooms</h2>
			</div>
			<div className='overflow-y-auto h-[calc(100%-57px)]'>
				{classrooms.map((classroom) => {
					// Ensure consistent type comparison
					const isSelected = String(classroom.id) === String(selectedClassroom)

					return (
						<div
							key={classroom.id}
							className={cn(
								'p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
								{
									'bg-gray-200 dark:bg-gray-800': isSelected,
								},
							)}
							onClick={() => onSelect(String(classroom.id))} // Ensure string ID
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
