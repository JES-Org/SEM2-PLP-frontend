'use client'

import React, { useEffect, useState } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTeacherClassroomQuery } from '@/store/classroom/classroomApi'
import { openDialog } from '@/store/features/classroomDialogSlice'
import { useGetTeacherByIdQuery } from '@/store/teacher/teacherApi'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import ClassroomDeleteDialog from '@/components/ClassroomDeleteDialog'
import { EllipsisVertical } from '@/components/Icons'
import SearchAndBell from '@/components/SearchAndBell'
import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ListOfClassroomPage = () => {
	const router = useRouter()
	const { getItem: getCurrUser } = useLocalStorage('currUser')
	const currUser = getCurrUser()
	const { data: currUserData, isSuccess: isSuccessCurrUser } =
		useGetTeacherByIdQuery(currUser.id)
	const {
		data: classrooms,
		isSuccess: isSuccessClassrooms,
		isLoading: isLoadingClassrooms,
		isFetching: isFetchingClassrooms,
		isError: isErrorClassrooms,
		error: classroomsError,
		refetch: refetchClassrooms,
	} = useTeacherClassroomQuery(currUser.id, { skip: !isSuccessCurrUser })
	const dispatch = useDispatch()

	const onDelete = (classroomid: string) => {
		console.log('Classroom Delete is clicked')
		dispatch(
			openDialog({
				activeDialog: 'delete',
				classroomIdTobeDeleted: classroomid,
			}),
		)
		refetchClassrooms()
	}

	return (
		<div className='md:flex overflow-x-hidden md:w-11/12 md:ml-auto h-screen'>
			<ClassroomDeleteDialog />
			<div className='flex-1 mt-20 md:pl-40'>
				<div>
					<SearchAndBell />
				</div>

				{isLoadingClassrooms || isFetchingClassrooms ? (
					<div className='flex justify-center items-center'>
						<Spinner />
					</div>
				) : classrooms?.data.length === 0 ? (
					<div className='flex justify-center items-center'>
						<p className='text-2xl text-gray-400 font-bold'>
							No classroom available
						</p>
					</div>
				) : (
					<div className='md:grid  md:grid-cols-2 lg:grid-cols-3 gap-4  md:mx-7 left-0 mx-auto '>
						{classrooms?.data.map((classroom) => (
							<div
								key={classroom.id}
								className='w-full mb-2 md:mb-0 hover:border hover:border-primary hover:rounded-xl transition duration-300 cursor-pointer'
								onClick={() =>
									router.push(`/teacher/classroom/${classroom.id}/announcement`)
								}
							>
								<Card>
									<CardHeader className='flex flex-row justify-between'>
										<CardTitle>{classroom.name}</CardTitle>
										<DropdownMenu>
											<DropdownMenuTrigger>
												<EllipsisVertical className='h-4 w-4' />
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuItem
													className='hover:bg-destructive hover:text-destructive-foreground cursor-pointer'
													onClick={(e) => {
														e.stopPropagation()
														onDelete(classroom.id)
													}}
												>
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</CardHeader>

									<CardFooter>
										<div className='flex items-center w-full justify-between'>
											<div className='flex items-center'>
												<Users size={20} className='mr-2' />
												<p>{classroom.members?.length}</p>
											</div>
											<p>{classroom.courseNo}</p>
										</div>
									</CardFooter>
								</Card>
							</div>
						))}
					</div>
				)}
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
