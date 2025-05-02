'use client'

import React, { useState } from 'react'

import { Calendar, CircleUser, Library, Pencil, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

import EditableProfileDatePickerField from '@/components/EditableProfileDatePickerField'
import EditableProfileFields from '@/components/EditableProfileFields'
import PhoneField from '@/components/PhoneField'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Page = () => {
	const router = useRouter()
	const [avatarUrl, setAvatarUrl] = useState('https://github.com/shadcn.png')
	const [phoneError, setPhoneError] = useState('')
	const [InputError, setInputError] = useState('')
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					setAvatarUrl(reader.result)
				} else {
					console.error('Error reading file')
				}
			}
			reader.readAsDataURL(file)
		}
	}
	const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		console.log(phoneError)
		if (phoneError || InputError) {
			return
		}
		router.push('/student/profile')
	}

	const handleFileInputChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		if (target.files) {
			handleFileUpload({
				target,
				currentTarget: target,
			} as React.ChangeEvent<HTMLInputElement>)
		}
	}

	const handleFileUploadClick = () => {
		const fileInput = document.createElement('input')
		fileInput.type = 'file'
		fileInput.accept = 'image/*'
		fileInput.onchange = handleFileInputChange
		fileInput.click()
	}
	return (
		<div>
			<div>
				<div className='flex justify-center pt-20 md:pl-40'>
					<div className='relative'>
						<Avatar className='w-40 h-40'>
							<AvatarImage src={avatarUrl} alt='Avatar' />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<Button
							className='absolute bottom-1 right-0'
							onClick={handleFileUploadClick}
						>
							<Pencil size={15} />
						</Button>
					</div>
				</div>
				<div className='md:pl-60 md:ml-0 ml-6'>
					<div className='md:flex justify-around w-full mb-8 space-y-8 md:space-y-0 my-14 '>
						<EditableProfileFields
							ProfileFieldItems={{
								icon: <CircleUser />,
								text: 'Full Name',
								value: 'Shadman Ahmed',
								setError: setInputError,
							}}
						/>
						<EditableProfileFields
							ProfileFieldItems={{
								icon: <Library />,
								text: 'Department',
								value: 'Computer science',
								setError: setInputError,
							}}
						/>
					</div>
					<div className='md:flex justify-around w-full mb-8 space-y-8 md:space-y-0'>
						<EditableProfileDatePickerField
							ProfileFieldItems={{
								icon: <Calendar />,
								text: 'Date of Birth',
								value: 'June 2, 2002',
								setError: setInputError,
							}}
						/>
						<PhoneField
							ProfileFieldItems={{
								icon: <Phone />,
								text: 'Phone',
								value: '97979779',
								setError: setPhoneError,
							}}
						/>
					</div>
					<div className='flex justify-center mt-10 w-full'>
						<Button
							className='text-center md:w-2/12 w-4/12'
							type='submit'
							onClick={handleSubmit}
						>
							Save
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Page
