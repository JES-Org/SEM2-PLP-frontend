'use client'

import {
	useGetClassroomByIdQuery,
	useRemoveStudentMutation,
} from '@/store/classroom/classroomApi'
import { Mail, PhoneIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { makeDateReadable } from '@/lib/helpers'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { EllipsisVertical } from './Icons'

const StudentPerClassroom = () => {
	const {getItem: getCurrUser} = useLocalStorage('currUser')
	const isCurrUserTeacher = getCurrUser().role === 1
	const classroomId = usePathname().split('/').at(-2)
	const {
		data: classroomData,
		isFetching: isFetchingClassroom,
		isSuccess: isSuccessClassroom,
		error: classroomError,
		isLoading: isLoadingClassroom,
	} = useGetClassroomByIdQuery(classroomId)
	const [
		removeStudent,
		{
			data: removeStudentData,
			isLoading: isLoadingRemoveStudent,
			isSuccess: isSuccessRemoveStudent,
			isError: isErrorRemoveStudent,
			error: removeStudentError,
		},
	] = useRemoveStudentMutation()

	const handleRemoveStudent = async (studentId: string) => {
		try {
			await removeStudent({ studentId, classroomId }).unwrap()
			if (isSuccessRemoveStudent) {
				toast.success('Student removed successfully')
			}
		} catch (error) {
			if (isErrorRemoveStudent) {
				toast.error('Failed to remove student')
			}
		}
	}

	return (
		<div className='ml-80 mr-12 my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{classroomData?.data.members?.map((student, i) => (
				<Card key={i} className='pb-6'>
					<CardHeader>
						{isCurrUserTeacher && <DropdownMenu>
							<DropdownMenuTrigger className='place-self-end'>
								<EllipsisVertical className='h-5 w-5 place-self-end cursor-pointer' />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className='focus:bg-destructive focus:text-destructive-foreground cursor-pointer'
									onClick={(e: any) => {
										e.stopPropagation()
										handleRemoveStudent(student.id!)
									}}
								>
									Remove
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>}
						<div className='flex items-center justify-center mb-6'>
							<Avatar className='w-24 h-24 border-4 border-gray-200 dark:border-gray-700'>
								<AvatarImage src='https://avatar.iran.liara.run/public/boy' />
								<AvatarFallback>{`${student.firstName?.[0] ?? ''}${student.lastName?.[0] ?? ''}`}</AvatarFallback>
							</Avatar>
						</div>
					</CardHeader>
					<div className='text-center space-y-2'>
						<h2 className='text-2xl font-bold text-card-foreground'>{`${student.firstName} ${student.lastName}`}</h2>
						<div className='text-card-foreground flex items-center justify-center gap-2'>
							<PhoneIcon className='h-5 w-5' />
							<span>
								{student.dateOfBirth
									? makeDateReadable(String(student.dateOfBirth))
									: ''}
							</span>
						</div>
						<div className='text-card-foreground flex items-center justify-center gap-2'>
							<Mail className='h-5 w-5' />
							<span>{student.email}</span>
						</div>
					</div>
				</Card>
			))}
		</div>
	)
}
export default StudentPerClassroom
