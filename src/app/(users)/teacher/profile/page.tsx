'use client'

import React from 'react'

import { Calendar, CircleUser, Library, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

import NonEditableProfileFields from '@/components/NonEditableProfileFields'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Page = () => {
	const router = useRouter()
	const handleSubmit = () => {
		router.push('/teacher/profile/edit')
	}

	return (
		<div>
			<div className='flex justify-center pt-20 md:pl-40'>
				<Avatar className='w-40 h-40'>
					<AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</div>

			<div className='container min-h-screen rounded-t-full bg-slate-100 md:bg-white mt-10'>
				<div className='md:flex justify-around pt-40 md:pt-0 md:pl-60'>
					<div className='md:flex flex-col md:ml-0 ml-3 items-start mb-8 space-y-8 md:space-y-0'>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <CircleUser />,
								text: 'Full Name',
								value: 'Shadman Ahmed',
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Library />,
								text: 'Department',
								value: 'Computer science',
							}}
						/>
					</div>
					<div className='md:flex flex-col md:ml-0 ml-3 items-start mb-8 space-y-8 md:space-y-0'>
						{/* Changed items-center to items-start */}
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Calendar />,
								text: 'Date of Birth',
								value: 'June 2, 2002',
							}}
						/>
						<NonEditableProfileFields
							ProfileFieldItems={{
								icon: <Phone />,
								text: 'Phone',
								value: '+25197979779',
							}}
						/>
					</div>
				</div>
				<div className='flex justify-center mt-10 w-full md:ml-0'>
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
