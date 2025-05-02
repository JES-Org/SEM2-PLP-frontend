import React, { useState } from 'react'

import { profileFieldItems } from '@/types/profileFieldItems'

import { Input } from '@/components/ui/input'

interface profileFieldsProps {
	ProfileFieldItems: profileFieldItems
}

const PhoneField = ({ ProfileFieldItems }: profileFieldsProps) => {
	const [value, setValue] = useState(ProfileFieldItems.value)
	const [error, setError] = useState('')

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)

		if (!event.target.value.trim()) {
			setError(`${ProfileFieldItems.text} is required`)
			ProfileFieldItems.setError(`${ProfileFieldItems.text} is required`)
		} else if (
			event.target.value.match(/[^0-9]/) ||
			event.target.value.length !== 8
		) {
			setError(
				`${ProfileFieldItems.text} should contain only numbers and have a length of 8.`,
			)
			ProfileFieldItems.setError(
				`${ProfileFieldItems.text} should contain only numbers and have a length of 8.`,
			)
		} else {
			setError('')
			ProfileFieldItems.setError('')
		}
	}

	return (
		<div className='flex flex-col space-y-3 md:w-5/12 w-11/12 '>
			<div className='flex items-center space-x-2'>
				<span>{ProfileFieldItems.icon}</span>
				<span className='flex-grow whitespace-nowrap'>
					{ProfileFieldItems.text}:
				</span>
			</div>
			<div className='flex items-center space-x-2'>
				<span className='bg-profile_input py-4 px-2 rounded-lg w-20 border'>
					+251
				</span>
				<Input
					defaultValue={value}
					onChange={handleChange}
					className='bg-profile_input py-7 rounded-lg'
				/>
			</div>
			{error && <div className='text-red-500'>{error}</div>}
		</div>
	)
}

export default PhoneField
