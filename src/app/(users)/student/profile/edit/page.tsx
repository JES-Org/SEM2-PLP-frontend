// @ts-nocheck
'use client'

import React, { useEffect, useState } from 'react'
import {
	useEditStudentProfileMutation,
	useGetStudentProfileQuery,
} from '@/store/student/studentApi'
import { Calendar, CircleUser, Mail, Pencil, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import EditableProfileDatePickerField from '@/components/EditableProfileDatePickerField'
import EditableProfileFields from '@/components/EditableProfileFields'
import PhoneField from '@/components/PhoneField'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Page = () => {
	const router = useRouter()
	const [phoneError, setPhoneError] = useState('')
	const [inputError, setInputError] = useState('')

	const { data: profile, isLoading, isError } = useGetStudentProfileQuery()
	const [editStudentProfile, { isLoading: isUpdating }] =
		useEditStudentProfileMutation()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [dob, setDob] = useState('')
	const [phone, setPhone] = useState('')
	const [avatarUrl, setAvatarUrl] = useState('https://github.com/shadcn.png')
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	useEffect(() => {
		if (profile) {
			setFirstName(profile.first_name || '')
			setLastName(profile.last_name || '')
			setEmail(profile.email || '')
			setDob(profile.dob || '')
			setPhone(profile.phone || '')
			if (profile.imageUrl) setAvatarUrl(profile.imageUrl)
		}
	}, [profile])

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setSelectedFile(file) // Store actual file
			const reader = new FileReader()
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					setAvatarUrl(reader.result) // For preview
				}
			}
			reader.readAsDataURL(file)
		}
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

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (phoneError || inputError) return

		const formData = new FormData()
		formData.append('first_name', firstName)
		formData.append('last_name', lastName)
		formData.append('phone', phone)
		formData.append('dob', dob)

		if (selectedFile) {
			formData.append('image', selectedFile) // ← this must be a File object
		}
		try {
			await editStudentProfile(formData).unwrap()
			toast.success('Profile updated successfully')
			router.push('/student/profile')
		} catch (err) {
			toast.error('Error updating profile')
			console.error(err)
		}
	}

	return (
		<div className='pt-20'>
			<div className='flex justify-center'>
				<div className='relative'>
					<Avatar className='w-40 h-40'>
						<AvatarImage src={avatarUrl} alt='Avatar' />
						<AvatarFallback>
							{firstName[0]}
							{lastName[0]}
						</AvatarFallback>
					</Avatar>
					<Button
						className='absolute bottom-1 right-0'
						onClick={handleFileUploadClick}
					>
						<Pencil size={15} />
					</Button>
				</div>
			</div>

			<div className='flex flex-col  md:pl-60 md:ml-0 ml-6 my-14'>
				<div className='md:flex justify-around space-y-8 md:space-y-0'>
					<EditableProfileFields
						ProfileFieldItems={{
							icon: <CircleUser />,
							text: 'First Name',
							value: firstName,
							onChange: setFirstName,
							setError: setInputError,
						}}
					/>
					<EditableProfileFields
						ProfileFieldItems={{
							icon: <CircleUser />,
							text: 'Last Name',
							value: lastName,
							onChange: setLastName,
							setError: setInputError,
						}}
					/>
				</div>

				<div className='md:flex justify-start md:pl-20 md:ml-0 mt-8 space-y-8 md:space-y-0'>
					<PhoneField
						ProfileFieldItems={{
							icon: <Phone />,
							text: 'Phone',
							value: phone,
							onChange: setPhone,
							setError: setPhoneError,
						}}
					/>
					
				</div>

				<div className='flex justify-center mt-10'>
					<Button
						className='md:w-2/12 w-4/12'
						type='submit'
						onClick={handleSubmit}
						disabled={isUpdating}
					>
						{isUpdating ? 'Saving...' : 'Save'}
					</Button>
				</div>
				
			</div>
		</div>
	)
}

export default Page
