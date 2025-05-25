'use client'

import React, { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
	useArchiveClassroomMutation,
	useTeacherClassroomQuery,
	useUnarchiveClassroomMutation,
} from '@/store/classroom/classroomApi'
import { openDialog } from '@/store/features/classroomDialogSlice'
import { useGetTeacherByIdQuery } from '@/store/teacher/teacherApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import ClassroomCard from '@/components/ClassroomCard'
import ClassroomDeleteDialog from '@/components/ClassroomDeleteDialog'
import SearchAndBell from '@/components/SearchAndBell'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'

const ListOfClassroomPage = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { getItem } = useLocalStorage('currUser')
	const currUser = getItem()

	const [searchTerm, setSearchTerm] = useState('')

	const { data: currUserData, isSuccess: isSuccessCurrUser } =
		useGetTeacherByIdQuery(currUser?.id)
	const {
		data: classrooms,
		isSuccess: isSuccessClassrooms,
		isLoading,
		refetch,
	} = useTeacherClassroomQuery(currUser?.teacher?.id, {
		skip: !isSuccessCurrUser,
	})

	const [archiveClassroom] = useArchiveClassroomMutation()
	const [unarchiveClassroom] = useUnarchiveClassroomMutation()

	const filteredClassrooms = classrooms?.data?.filter((c) =>
		c.name.toLowerCase().includes(searchTerm.toLowerCase()),
	)
	const unarchivedClassrooms =
		filteredClassrooms?.filter((c) => !c.is_archived) || []
	const archivedClassrooms =
		filteredClassrooms?.filter((c) => c.is_archived) || []
	const handleDelete = (id: string) => {
		dispatch(openDialog({ activeDialog: 'delete', classroomIdTobeDeleted: id }))
		refetch()
	}

	const handleArchiveToggle = async (id: string, is_archived: boolean) => {
		if (is_archived) await unarchiveClassroom(id)
		else await archiveClassroom(id)
		refetch()
	}

	return (
		<div className='md:flex overflow-x-hidden md:w-11/12 md:ml-auto h-screen'>
			<ClassroomDeleteDialog />
			<div className='flex-1 mt-20 md:pl-40'>
				<SearchAndBell onSearchChange={setSearchTerm} />

				{isLoading ? (
					<div className='flex justify-center items-center'>
						<Spinner />
					</div>
				) : (
					<div className='md:mx-7'>
						{/* Active Classrooms */}
						<h2 className='text-2xl font-bold text-primary mb-6 border-b pb-2'>
							Active Classrooms
						</h2>
						{unarchivedClassrooms.length === 0 ? (
							<div className='flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 p-6 rounded-lg shadow-sm'>
								<p className='text-center text-base italic'>
									No active classrooms found.
								</p>
							</div>
						) : (
							<div className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10'>
								{unarchivedClassrooms.map((classroom) => (
									<ClassroomCard
										key={classroom.id}
										classroom={classroom}
										router={router}
										onArchiveToggle={handleArchiveToggle}
										onDelete={handleDelete}
									/>
								))}
							</div>
						)}

						{/* Archived Classrooms */}
						{archivedClassrooms.length > 0 && (
							<div>
							<h2 className='text-2xl font-bold text-primary mb-6 border-b pb-2'>Archived Classrooms</h2>

								<div className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
									{archivedClassrooms.map((classroom) => (
										<ClassroomCard
											key={classroom.id}
											classroom={classroom}
											router={router}
											onArchiveToggle={handleArchiveToggle}
											onDelete={handleDelete}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Create Button */}
				<div className='ml-8 mt-10 block'>
					<Button>
						<Link href='/teacher/classroom/create-classroom'>
							Create Classroom
						</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ListOfClassroomPage
