// @ts-nocheck
'use client'
import React,{useEffect} from 'react'
import {  Calendar, CircleUser, GraduationCap, Landmark, Library, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

import NonEditableProfileFields from '@/components/NonEditableProfileFields'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useGetStudentProfileQuery } from '@/store/student/studentApi'
import { IdCardIcon } from '@radix-ui/react-icons'

const Page = () => {
	const router = useRouter()
	const { data: profile, isLoading, isError, refetch } = useGetStudentProfileQuery(undefined, {
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

	if (isLoading) return <div className='text-center mt-20'>Loading profile...</div>
	if (isError || !profile) return <div className='text-center mt-20 text-red-500'>Failed to load profile.</div>
    console.log("student profile update",profile)
	return (
		<div>
			<div className='flex justify-center pt-20 md:pl-40'>
				<Avatar className='w-40 h-40'>

					<AvatarImage src={profile.imageUrl || 'https://github.com/shadcn.png'} alt='Profile' />
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
								icon: <Landmark />,
								text: 'Department',
								value: profile.batch_details?.department_details?.name || 'N/A',
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <IdCardIcon />,
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
								value: profile.email
,
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
								icon: <GraduationCap />,
								text: 'Year & Section',
								value: `Year ${profile.year}, Section ${profile.section}`,
							}}
						/>
					</div>
				</div>
				<div className='flex justify-center mt-6 w-full md:ml-0'>
					<Button
						className='text-center md:w-2/12 w-4/12 md:ml-40 '
						onClick={handleSubmit}
					>
						Edit
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Page
