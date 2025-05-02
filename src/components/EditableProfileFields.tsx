import React, { useState } from 'react'

import { profileFieldItems } from '@/types/profileFieldItems'

import { Input } from '@/components/ui/input'

interface profileFieldsProps {
	ProfileFieldItems: profileFieldItems
}

const EditableProfileFields = ({ ProfileFieldItems }: profileFieldsProps) => {
	const [value, setValue] = useState(ProfileFieldItems.value)
	const [error, setError] = useState('')

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		setValue(inputValue)

		if (!inputValue.trim()) {
			setError(`${ProfileFieldItems.text} is required`)
			ProfileFieldItems.setError(`${ProfileFieldItems.text} is required`)
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
			<Input
				defaultValue={value}
				onChange={handleChange}
				className='bg-profile_input py-7 rounded-lg'
			/>
			{error && <div className='text-red-500'>{error}</div>}
		</div>
	)
}

export default EditableProfileFields
