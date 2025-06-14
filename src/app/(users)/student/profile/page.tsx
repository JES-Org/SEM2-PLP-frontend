// @ts-nocheck
'use client'

import React, { useEffect } from 'react'

import { openDialog } from '@/store/features/studentDialogSlice'
import { useGetStudentProfileQuery } from '@/store/student/studentApi'
import { Calendar, CircleUser, Library, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

import NonEditableProfileFields from '@/components/NonEditableProfileFields'
import StudentDeleteDialog from '@/components/StudentDeleteDialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Page = () => {
	const router = useRouter()
	const dispatch = useDispatch()

	const {
		data: profile,
		isLoading,
		isError,
		refetch,
	} = useGetStudentProfileQuery(undefined, {
		refetchOnMountOrArgChange: true,
	})
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				refetch()
			}
		}
		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	}, [refetch])

	const handleSubmit = () => {
		router.push('/student/profile/edit')
	}

	if (isLoading)
		return <div className='text-center mt-20'>Loading profile...</div>
	if (isError || !profile)
		return (
			<div className='text-center mt-20 text-red-500'>
				Failed to load profile.
			</div>
		)
	return (
		<div>
			<StudentDeleteDialog />
			<div className='flex justify-center pt-20 md:pl-40'>
				<Avatar className='w-40 h-40'>
					<AvatarImage
						src={profile.imageUrl || 'https://github.com/shadcn.png'}
						alt='Profile'
					/>
					<AvatarFallback>
						{profile.first_name?.[0]?.toUpperCase() ?? 'U'}
						{profile.last_name?.[0]?.toUpperCase() ?? ''}
					</AvatarFallback>
				</Avatar>
			</div>

			<div className='container min-h-screen rounded-t-full bg-slate-100 md:bg-white mt-10'>
				<div className='md:flex justify-around pt-40 md:pt-0 md:pl-60'>
					<div className='md:flex flex-col md:ml-0 ml-3 items-start mb-8 space-y-8 md:space-y-0'>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <CircleUser />,
								text: 'Full Name',
								value: `${profile.first_name} ${profile.last_name}`,
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Library />,
								text: 'Department',
								value: profile.batch_details?.department_details?.name || 'N/A',
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Library />,
								text: 'Student ID',
								value: profile.student_id,
							}}
						/>
					</div>
					<div className='md:flex flex-col md:ml-0 ml-3 items-start mb-8 space-y-8 md:space-y-0'>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Calendar />,
								text: 'Email',
								value: profile.email,
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Phone />,
								text: 'Phone',
								value: profile.phone,
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Library />,
								text: 'Year & Section',
								value: `Year ${profile.year}, Section ${profile.section}`,
							}}
						/>
					</div>
				</div>
				<div className='flex flex-col md:flex-row justify-center items-center gap-4 mt-10 w-full'>
					<Button className='w-full md:w-2/12' onClick={handleSubmit}>
						Edit
					</Button>

					<Button
						variant='destructive'
						className='w-full md:w-2/12'
						onClick={() => dispatch(openDialog('deleteAccount'))}
					>
						Delete Account
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Page
