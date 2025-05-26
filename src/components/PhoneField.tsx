import React, { useState } from 'react'

import { profileFieldItems } from '@/types/profileFieldItems'

import { Input } from '@/components/ui/input'

interface profileFieldsProps {
	ProfileFieldItems: profileFieldItems
}

const PhoneField = ({ ProfileFieldItems }: profileFieldsProps) => {
	const [value, setValue] = useState(ProfileFieldItems.value)
	const [error, setError] = useState('')

	const isValidEthiopianPhone = (val: string): boolean => {
		val = val.trim()

		// Check if all characters are numeric (except optional '+' at start)
		const isValidChars = val.startsWith('+')
			? val
					.slice(1)
					.split('')
					.every((char) => !isNaN(Number(char)))
			: val.split('').every((char) => !isNaN(Number(char)))

		if (!isValidChars) return false

		// Local formats: 09xxxxxxxx or 07xxxxxxxx (10 digits)
		if (val.length === 10 && (val.startsWith('09') || val.startsWith('07'))) {
			return true
		}

		if (
			val.length === 13 &&
			(val.startsWith('+2519') || val.startsWith('+2517'))
		) {
			return true
		}

		return false
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const val = event.target.value
		setValue(val)
		ProfileFieldItems.onChange(val)

		if (!val.trim()) {
			setError(`${ProfileFieldItems.text} is required`)
			ProfileFieldItems.setError(`${ProfileFieldItems.text} is required`)
		} else if (!isValidEthiopianPhone(val)) {
			const msg = `${ProfileFieldItems.text} must be a valid Ethiopian phone number starting with 09, 07, +2519 or +2517.`
			setError(msg)
			ProfileFieldItems.setError(msg)
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
					value={ProfileFieldItems.value}
					onChange={handleChange}
					className='bg-profile_input py-7 rounded-lg'
				/>
			</div>
			{error && <div className='text-red-500'>{error}</div>}
		</div>
	)
}

export default PhoneField
