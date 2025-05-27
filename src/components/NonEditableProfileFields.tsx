'use client'

import React from 'react'
import { nonEditableProfileFieldItems } from '@/types/profileFieldItems'

interface profileFieldsProps {
	ProfileFieldItems: nonEditableProfileFieldItems
}

const NonEditableProfileFields = ({
	ProfileFieldItems,
}: profileFieldsProps) => {
	return (
		<div className='flex md:justify-center w-full'>
			<div className='flex my-3 mx-12 md:w-full w-11/12'>
				<div className='flex justify-center items-center space-x-2 '>
					<span>{ProfileFieldItems.icon}</span>
					<span className='flex-grow whitespace-nowrap'>
						{ProfileFieldItems.text}:
					</span>
				</div>
				<div className='my- mx-5'>{ProfileFieldItems.value}</div>
			</div>
		</div>
	)
}

export default NonEditableProfileFields
