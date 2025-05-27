// @ts-check

import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

type ScoreProfileProps = {
	studentName?: string;
	score?: number;
	rank?: number;
};

const ScoreProfile: React.FC<ScoreProfileProps> = ({ studentName, score, rank }) => {
	const getInitials = (name: string | undefined) => {
		if (!name) return 'ST';
		return name
		.split(' ')
		.map(part => part[0])
		.join('')
		.toUpperCase()
		.substring(0, 2);
	};

	return (
		<Card className='flex items-center justify-between md:px-3 pt-5 mb-1 w-full'>
			<CardContent className='flex justify-between items-center w-full'>
				<div className='flex items-center mr-2'>
					<Avatar className='mr-2'>
						<AvatarImage src='https://studnet.png' alt={studentName} />
						<AvatarFallback>{getInitials(studentName)}</AvatarFallback>
					</Avatar>
					<span>{studentName || 'Unknown Student'}</span>
				</div>
				<div className='2xl:text-md text-sm'>{score !== undefined ? score : 0}</div>
			</CardContent>
		</Card>
	)
}

export default ScoreProfile
