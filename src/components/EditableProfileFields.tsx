import React, { useState, useEffect } from 'react'
import { profileFieldItems } from '@/types/profileFieldItems'
import { Input } from '@/components/ui/input'

interface ProfileFieldsProps {
	ProfileFieldItems: profileFieldItems
}

const EditableProfileFields = ({ ProfileFieldItems }: ProfileFieldsProps) => {
	const [value, setValue] = useState(ProfileFieldItems.value)
	const [error, setError] = useState('')

	useEffect(() => {
		setValue(ProfileFieldItems.value) // update local value if parent value changes
	}, [ProfileFieldItems.value])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		setValue(inputValue)

		if (!inputValue.trim()) {
			const errorMsg = `${ProfileFieldItems.text} is required`
			setError(errorMsg)
			ProfileFieldItems.setError(errorMsg)
		} else {
			setError('')
			ProfileFieldItems.setError('')
		}

		ProfileFieldItems.onChange(inputValue) // propagate change to parent
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
				value={value}
				onChange={handleChange}
				className='bg-profile_input py-7 rounded-lg'
			/>
			{error && <div className='text-red-500'>{error}</div>}
		</div>
	)
}

export default EditableProfileFields
